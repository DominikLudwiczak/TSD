import axios from './axios'; // upewnij się, że masz axios.js z baseURL

// Tworzy nową sesję estymacyjną
export const createSession = (roomId, creatorId) =>
  axios.post('/sessions', {
    roomId,
    creator: creatorId,
  });

// Pobiera wszystkie sesje w pokoju
export const getSessionsByRoom = (roomId) =>
  axios.get(`/sessions/room/${roomId}`);

// Dodaje estymację do sesji
export const addEstimation = (sessionId, userId, value) =>
  axios.post(`/sessions/${sessionId}/estimation`, {
    userId,
    value,
  });

// Pobiera jedną sesję
export const getSessionById = (sessionId) =>
  axios.get(`/sessions/${sessionId}`);

// Ujawnia estymacje
export const revealEstimations = (sessionId) =>
  axios.post(`/sessions/${sessionId}/reveal`);

// Resetuje estymacje
export const resetSession = (sessionId) =>
  axios.post(`/sessions/${sessionId}/reset`);
