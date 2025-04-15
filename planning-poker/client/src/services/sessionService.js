// src/services/sessionService.js
import api from './api';

export const createSession = async (sessionData) => {
  try {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const getSessionById = async (sessionId) => {
  try {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

export const getSessionsByRoom = async (roomId) => {
  try {
    const response = await api.get(`/sessions/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions for room:', error);
    throw error;
  }
};

export const addEstimation = async (sessionId, userId, cardId) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/estimation`, {
      user: userId,
      card: cardId
    });
    return response.data;
  } catch (error) {
    console.error('Error adding estimation:', error);
    throw error;
  }
};

export const revealEstimations = async (sessionId) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/reveal`);
    return response.data;
  } catch (error) {
    console.error('Error revealing estimations:', error);
    throw error;
  }
};

export const resetSession = async (sessionId) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/reset`);
    return response.data;
  } catch (error) {
    console.error('Error resetting session:', error);
    throw error;
  }
};

export const completeSession = async (sessionId) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing session:', error);
    throw error;
  }
};

export const addSessionNotes = async (sessionId, notes) => {
  try {
    const response = await api.put(`/sessions/${sessionId}/notes`, { notes });
    return response.data;
  } catch (error) {
    console.error('Error adding session notes:', error);
    throw error;
  }
};

export const deleteSession = async (sessionId) => {
  try {
    await api.delete(`/sessions/${sessionId}`);
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};