import axios from './axios'; // zakładam, że masz axios.js z baseURL

// Tworzenie użytkownika
export const createUser = (userData) =>
  axios.post('/users', userData);

// Pobranie użytkownika po nazwie użytkownika
export const getUserByUsername = (username) =>
  axios.get(`/users/${username}`);

// Aktualizacja danych użytkownika (np. nazwy, roli)
export const updateUser = (userId, updates) =>
  axios.put(`/users/${userId}`, updates);

// Usunięcie użytkownika
export const deleteUser = (userId) =>
  axios.delete(`/users/${userId}`);

// Aktualizacja timestampu aktywności
export const updateActivity = (userId) =>
  axios.put(`/users/${userId}/activity`, {
    lastActiveAt: new Date().toISOString(),
  });
