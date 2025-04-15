// src/services/cardService.js
import api from './api';

export const getAllCards = async (deckType) => {
  try {
    const params = deckType ? { deckType } : {};
    const response = await api.get('/cards', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const getCardById = async (id) => {
  try {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card:', error);
    throw error;
  }
};

export const createCard = async (cardData) => {
  try {
    const response = await api.post('/cards', cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

export const updateCard = async (id, cardData) => {
  try {
    const response = await api.put(`/cards/${id}`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const deleteCard = async (id) => {
  try {
    await api.delete(`/cards/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};