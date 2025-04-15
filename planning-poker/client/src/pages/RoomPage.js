import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, addParticipant } from '../services/roomService';
import { createSession, getSessionsByRoom } from '../services/sessionService';
import { useSocket } from '../contexts/SocketContext';
import CardDeck from '../components/CardDeck';
import Loading from '../components/Layout/Loading';
import Error from '../components/Layout/Error';

const RoomPage = ({ user }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [room, setRoom] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionFormLoading, setSessionFormLoading] = useState(false);
  
  // Fetch room data and join room
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        
        // Get room details
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
        setParticipants(roomData.participants || []);
        
        // Get sessions for this room
        const sessionsData = await getSessionsByRoom(roomId);
        setSessions(sessionsData);
        
        // Find active session if exists
        const activeSession = sessionsData.find(s => s.status === 'active');
        if (activeSession) {
          setCurrentSession(activeSession);
          setIsRevealed(false);
        } else {
          const revealedSession = sessionsData.find(s => s.status === 'revealed');
          if (revealedSession) {
            setCurrentSession(revealedSession);
            setIsRevealed(true);
          }
        }
        
        // Join the room if not already a participant
        if (!roomData.participants.some(p => p.user._id === user._id)) {
          await addParticipant(roomId, user._id);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load room data: ' + (err.message || 'Unknown error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (roomId && user) {
      fetchRoomData();
    }
  }, [roomId, user]);
  
  // Socket connection
  useEffect(() => {
    if (!socket || !room) return;
    
    // Join socket room
    socket.emit('join-room', roomId, user._id);
    
    // Socket event handlers
    const handleUserJoined = (userId) => {
      console.log(`User ${userId} joined the room`);
      // Update participants list if needed
    };
    
    const handleCardSelected = ({ userId, cardValue }) => {
      console.log(`User ${userId} selected card: ${cardValue}`);
      // Update UI to reflect user's selection
    };
    
    const handleCardsRevealed = (sessionId) => {
      if (currentSession && currentSession._id === sessionId) {
        setIsRevealed(true);
      }
    };
    
    const handleEstimationReset = (sessionId) => {
      if (currentSession && currentSession._id === sessionId) {
        setIsRevealed(false);
        setSelectedCard(null);
      }
    };
    
    // Register event listeners
    socket.on('user-joined', handleUserJoined);
    socket.on('card-selected', handleCardSelected);
    socket.on('cards-revealed', handleCardsRevealed);
    socket.on('estimation-reset', handleEstimationReset);
    
    // Cleanup
    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('card-selected', handleCardSelected);
      socket.off('cards-revealed', handleCardsRevealed);
      socket.off('estimation-reset', handleEstimationReset);
    };
  }, [socket, room, roomId, user, currentSession]);
  
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    
    if (socket && currentSession) {
      socket.emit('select-card', roomId, user._id, card._id);
    }
  };
  
  const handleRevealCards = () => {
    if (socket && currentSession) {
      socket.emit('reveal-cards', roomId, currentSession._id);
      setIsRevealed(true);
    }
  };
  
  const handleResetEstimation = () => {
    if (socket && currentSession) {
      socket.emit('reset-estimation', roomId, currentSession._id);
      setIsRevealed(false);
      setSelectedCard(null);
    }
  };
  
  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      return;
    }
    
    try {
      setSessionFormLoading(true);
      
      const sessionData = {
        room: roomId,
        taskName: taskName.trim(),
        taskDescription: taskDescription.trim(),
        status: 'active'
      };
      
      const newSession = await createSession(sessionData);
      setCurrentSession(newSession);
      setSessions([...sessions, newSession]);
      setIsRevealed(false);
      setSelectedCard(null);
      setShowSessionForm(false);
      setTaskName('');
      setTaskDescription('');
    } catch (err) {
      console.error('Failed to create session:', err);
    } finally {
      setSessionFormLoading(false);
    }
  };
  
  if (loading) return <Loading message="Loading room..." />;
  if (error) return <Error message={error} />;
  if (!room) return <Error message="Room not found" />;
  
  const isModerator = room.creator === user._id;
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Rooms
        </button>
      </div>
      
      {room.description && (
        <p className="text-gray-600 mb-6">{room.description}</p>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current session */}
          {currentSession ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{currentSession.taskName}</h2>
                <span className={`px-2 py-1 text-xs rounded ${
                  currentSession.status === 'active' ? 'bg-green-100 text-green-800' : 
                  currentSession.status === 'revealed' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentSession.status}
                </span>
              </div>
              
              {currentSession.taskDescription && (
                <p className="text-gray-600 mb-4">{currentSession.taskDescription}</p>
              )}
              
              <div className="mb-6">
                <CardDeck 
                  deckType={room.deckType}
                  onSelectCard={handleCardSelect}
                  selectedCard={selectedCard}
                  isRevealed={isRevealed}
                />
              </div>
              
              {isModerator && (
                <div className="flex justify-center space-x-4 border-t pt-4">
                  {!isRevealed ? (
                    <button
                      onClick={handleRevealCards}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={currentSession.status !== 'active'}
                    >
                      Reveal Cards
                    </button>
                  ) : (
                    <button
                      onClick={handleResetEstimation}
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Reset Estimation
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">No Active Session</h2>
              {isModerator && (
                <button
                  onClick={() => setShowSessionForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Start New Session
                </button>
              )}
            </div>
          )}
          
          {/* Session form */}
          {showSessionForm && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Session</h2>
              <form onSubmit={handleCreateSession}>
                <div className="mb-4">
                  <label htmlFor="taskName" className="block text-gray-700 font-medium mb-2">
                    Task Name*
                  </label>
                  <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="taskDescription" className="block text-gray-700 font-medium mb-2">
                    Task Description
                  </label>
                  <textarea
                    id="taskDescription"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSessionForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sessionFormLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {sessionFormLoading ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Session history */}
          {sessions.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Session History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Started
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Final Estimation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <tr key={session._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{session.taskName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            session.status === 'active' ? 'bg-green-100 text-green-800' : 
                            session.status === 'revealed' ? 'bg-blue-100 text-blue-800' : 
                            session.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''
                          }`}>
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(session.startedAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {session.finalEstimation ? session.finalEstimation.displayValue : '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Participants */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Participants ({participants.length})</h2>
            <ul className="divide-y divide-gray-200">
              {participants.map((participant) => (
                <li key={participant.user._id} className="py-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="flex-grow">
                    {participant.user.displayName || participant.user.username || 'Unknown'}
                    {participant.user._id === user._id && ' (You)'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {participant.role || 'developer'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Room Settings */}
          {isModerator && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Room Settings</h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Deck Type</span>
                  <span className="text-gray-900">{room.deckType}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Created</span>
                  <span className="text-gray-900">{new Date(room.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;