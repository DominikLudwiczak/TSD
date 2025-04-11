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