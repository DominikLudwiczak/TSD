// src/services/userService.js
import api from './api';

export const getUserByUsername = async (username) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateUserActivity = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/activity`, { 
      lastActive: new Date().toISOString() 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user activity:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};