// server.js - główny plik serwera
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


// Konfiguracja zmiennych środowiskowych
dotenv.config();

// Inicjalizacja aplikacji Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Połączenie z bazą danych MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planning-poker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Importowanie modeli
const User = require('./models/User');
const Room = require('./models/Room');
const Card = require('./models/Card');

// Importowanie tras API
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const cardRoutes = require('./routes/cards');

// Rejestracja tras
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/cards', cardRoutes);

// Podstawowa trasa
app.get('/', (req, res) => {
  res.send('Planning Poker API is running');
});

// Obsługa Socket.io
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Dołączanie do pokoju
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    
    // Powiadomienie innych użytkowników o dołączeniu
    socket.to(roomId).emit('user-joined', userId);
  });

  // Wybór karty
  socket.on('select-card', (roomId, userId, cardValue) => {
    socket.to(roomId).emit('card-selected', { userId, cardValue });
  });

  // Reset estymacji
  socket.on('reset-estimation', (roomId) => {
    io.to(roomId).emit('estimation-reset');
  });

  // Rozłączenie klienta
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Port serwera
const PORT = process.env.PORT || 5000;

// Uruchomienie serwera
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };