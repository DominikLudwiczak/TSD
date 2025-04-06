// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Konfiguracja zmiennych środowiskowych
dotenv.config();

// Inicjalizacja aplikacji Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Połączenie z bazą danych MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planning-poker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Podstawowa trasa
app.get('/', (req, res) => {
  res.send('Planning Poker API is running');
});

// Port serwera
const PORT = process.env.PORT || 5000;

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});