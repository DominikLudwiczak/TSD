import axios from './axios'; // zakładam, że masz axios z baseURL

// Tworzenie pokoju
export const createRoom = (roomData) =>
  axios.post('/rooms', roomData);

// Pobranie wszystkich pokoi
export const getAllRooms = () =>
  axios.get('/rooms');

// Pobranie pokoju po ID
export const getRoomById = (id) =>
  axios.get(`/rooms/${id}`);

// Dodanie uczestnika do pokoju
export const addParticipant = (roomId, participantData) =>
  axios.post(`/rooms/${roomId}/participants`, participantData);

// Usunięcie uczestnika
export const removeParticipant = (roomId, userId) =>
  axios.delete(`/rooms/${roomId}/participants/${userId}`);

// Zmiana ustawień pokoju
export const updateRoomSettings = (roomId, settings) =>
  axios.put(`/rooms/${roomId}/settings`, settings);

// Usunięcie pokoju
export const deleteRoom = (id) =>
  axios.delete(`/rooms/${id}`);
