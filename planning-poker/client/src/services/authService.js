// src/services/authService.js
import api from './api';
import { getUserByUsername, createUser } from './userService';

export const login = async (username) => {
  try {
    // Try to get user by username
    const user = await getUserByUsername(username);
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // User not found, create new user
      console.log('User not found, creating new user...');
      const newUser = await createUser({ 
        username, 
        displayName: username,
        role: 'developer'
      });
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user from storage:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};