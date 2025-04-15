import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, addEstimation } from '../services/sessionService';
import { getRoomById } from '../services/roomService';
import { useSocket } from '../contexts/SocketContext';
import CardDeck from '../components/CardDeck';
import Loading from '../components/Layout/Loading';
import Error from '../components/Layout/Error';

const SessionPage = ({ user }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [estimations, setEstimations] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        
        // Get session details
        const sessionData = await getSessionById(sessionId);
        setSession(sessionData);
        setEstimations(sessionData.estimations || []);
        setIsRevealed(sessionData.status === 'revealed' || sessionData.status === 'completed');
        
        // Get room details
        if (sessionData.room) {
          const roomData = await getRoomById(sessionData.room);
          setRoom(roomData);
          
          // Join socket room
          if (socket) {
            socket.emit('join-room', roomData._id, user._id);
          }
        }
        
        // Check if user has already estimated
        const userEstimation = sessionData.estimations.find(
          est => est.user === user._id || est.user._id === user._id
        );
        if (userEstimation) {
          setSelectedCard(userEstimation.card);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load session: ' + (err.message || 'Unknown error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (sessionId) {
      fetchSessionData();
    }
    
    return () => {
      // Leave socket room if necessary
    };
  }, [sessionId, user._id, socket]);
  
  useEffect(() => {
    if (!socket || !room) return;
    
    // Socket event handlers
    const handleCardSelected = ({ userId, cardValue }) => {
      console.log(`User ${userId} selected card: ${cardValue}`);
      // Update estimations list
    };
    
    const handleCardsRevealed = (revealedSessionId) => {
      if (sessionId === revealedSessionId) {
        setIsRevealed(true);
      }
    };
    
    const handleEstimationReset = (resetSessionId) => {
      if (sessionId === resetSessionId) {
        setIsRevealed(false);
        setSelectedCard(null);
      }
    };
    
    // Register event listeners
    socket.on('card-selected', handleCardSelected);
    socket.on('cards-revealed', handleCardsRevealed);
    socket.on('estimation-reset', handleEstimationReset);
    
    // Cleanup
    return () => {
      socket.off('card-selected', handleCardSelected);
      socket.off('cards-revealed', handleCardsRevealed);
      socket.off('estimation-reset', handleEstimationReset);
    };
  }, [socket, room, sessionId]);
  
  const handleCardSelect = async (card) => {
    setSelectedCard(card);
    
    try {
      // Add estimation via API
      await addEstimation(sessionId, user._id, card._id);
      
      // Notify via socket
      if (socket && room) {
        socket.emit('select-card', room._id, user._id, card._id);
      }
    } catch (err) {
      console.error('Error selecting card:', err);
    }
  };
  
  const handleReveal = () => {
    if (socket && room) {
      socket.emit('reveal-cards', room._id, sessionId);
      setIsRevealed(true);
    }
  };
  
  const handleReset = () => {
    if (socket && room) {
      socket.emit('reset-estimation', room._id, sessionId);
      setIsRevealed(false);
      setSelectedCard(null);
    }
  };
  
  if (loading) return <Loading message="Loading session..." />;
  if (error) return <Error message={error} />;
  if (!session) return <Error message="Session not found" />;
  
  const isModerator = room && room.creator === user._id;
  const deckType = room ? room.deckType : 'fibonacci';
  
  // Calculate stats
  const stats = isRevealed && estimations.length > 0 ? {
    count: estimations.length,
    avg: 'N/A', // Would need to calculate based on card values
    min: 'N/A',
    max: 'N/A'
  } : null;
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{session.taskName || 'Estimation Session'}</h1>
        {room && (
          <button
            onClick={() => navigate(`/rooms/${room._id}`)}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Room
          </button>
        )}
      </div>
      
      {session.taskDescription && (
        <p className="text-gray-600 mb-6">{session.taskDescription}</p>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Your Estimation</h2>
            <CardDeck 
              deckType={deckType} 
              onSelectCard={handleCardSelect}
              selectedCard={selectedCard}
              isRevealed={isRevealed}
              disabled={session.status === 'completed'}
            />
          </div>
          
          {isModerator && session.status !== 'completed' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Session Controls</h2>
              <div className="flex justify-center space-x-4">
                {!isRevealed ? (
                  <button
                    onClick={handleReveal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reveal Cards
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Reset Estimation
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estimations</h2>
            {!isRevealed ? (
              <ul className="divide-y divide-gray-200">
                {estimations.map((est, index) => (
                  <li key={index} className="py-3 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="flex-grow">
                      {est.user.displayName || est.user.username || 'User ' + (index + 1)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      Voted
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                {stats && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Total votes:</div>
                      <div className="font-medium">{stats.count}</div>
                      
                      {stats.avg !== 'N/A' && (
                        <>
                          <div>Average:</div>
                          <div className="font-medium">{stats.avg}</div>
                        </>
                      )}
                      
                      {stats.min !== 'N/A' && (
                        <>
                          <div>Min:</div>
                          <div className="font-medium">{stats.min}</div>
                        </>
                      )}
                      
                      {stats.max !== 'N/A' && (
                        <>
                          <div>Max:</div>
                          <div className="font-medium">{stats.max}</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <ul className="divide-y divide-gray-200">
                  {estimations.map((est, index) => (
                    <li key={index} className="py-3 flex items-center">
                      <span className="flex-grow">
                        {est.user.displayName || est.user.username || 'User ' + (index + 1)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {est.card ? est.card.displayValue : '?'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Session Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{session.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span className="font-medium">{new Date(session.startedAt).toLocaleString()}</span>
              </div>
              {session.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">{new Date(session.completedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;