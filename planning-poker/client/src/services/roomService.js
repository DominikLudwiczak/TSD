// src/services/roomService.js
import api from './api';

export const getAllRooms = async () => {
  try {
    const response = await api.get('/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};

export const createRoom = async (roomData) => {
  // Ensure we have the required fields in the proper format
  const formattedRoom = {
    name: roomData.name,
    description: roomData.description || '',
    creator: roomData.creator, // This must be the user ID, not the full user object
    deckType: roomData.deckType || 'fibonacci',
    participants: [
      {
        user: roomData.creator, // User ID as string
        joinedAt: new Date().toISOString(),
        isActive: true
      }
    ],
    isActive: true,
  };

  console.log('Sending formatted room data to API:', formattedRoom);

  try {
    const response = await api.post('/rooms', formattedRoom);
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    
    // Log the specific error response if available
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    throw error;
  }
};

export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    await api.delete(`/rooms/${roomId}`);
    return true;
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

export const addParticipant = async (roomId, userId) => {
  try {
    const response = await api.post(`/rooms/${roomId}/participants`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
};

export const removeParticipant = async (roomId, userId) => {
  try {
    await api.delete(`/rooms/${roomId}/participants/${userId}`);
    return true;
  } catch (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
};

export const updateRoomSettings = async (roomId, settings) => {
  try {
    const response = await api.put(`/rooms/${roomId}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating room settings:', error);
    throw error;
  }
};