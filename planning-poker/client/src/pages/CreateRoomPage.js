// src/pages/CreateRoomPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../services/roomService';
import Loading from '../components/Layout/Loading';
import Error from '../components/Layout/Error';
import { getCurrentUser } from '../services/authService';

const CreateRoomPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deckType, setDeckType] = useState('fibonacci');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect to login if no user found
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Room name is required');
      return;
    }

    if (!user || !user._id) {
      setError('User information is missing. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create room with just the required data in the expected format
      const roomData = {
        name: name.trim(),
        description: description.trim(),
        deckType,
        creator: user._id, // Just the ID as string, not the full user object
      };
      
      console.log('Creating room with data:', roomData);
      
      const newRoom = await createRoom(roomData);
      console.log('Room created successfully:', newRoom);
      navigate(`/rooms/${newRoom._id}`);
    } catch (err) {
      console.error('Error creating room:', err);
      
      // Providing more detailed error information
      let errorMessage = 'Failed to create room';
      
      if (err.response) {
        errorMessage += `: ${err.response.status} - ${JSON.stringify(err.response.data || {})}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Creating room..." />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Planning Poker Room</h1>
      
      {error && <Error message={error} />}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Room Name*
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="deckType" className="block text-gray-700 font-medium mb-2">
            Deck Type
          </label>
          <select
            id="deckType"
            value={deckType}
            onChange={(e) => setDeckType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fibonacci">Fibonacci (1, 2, 3, 5, 8, 13, ...)</option>
            <option value="tshirt">T-Shirt (XS, S, M, L, XL, ...)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoomPage;