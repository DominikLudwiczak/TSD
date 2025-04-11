// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Połączenie z bazą danych
connectDB();

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', routes);

// Podstawowa trasa
app.get('/', (req, res) => {
  res.send('Planning Poker API is running. See /api-docs for documentation.');
});

// Socket.io handlers
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

  // Ujawnienie kart
  socket.on('reveal-cards', (roomId, sessionId) => {
    io.to(roomId).emit('cards-revealed', sessionId);
  });

  // Reset estymacji
  socket.on('reset-estimation', (roomId, sessionId) => {
    io.to(roomId).emit('estimation-reset', sessionId);
  });

  // Ukończenie sesji
  socket.on('complete-session', (roomId, sessionId, finalEstimation) => {
    io.to(roomId).emit('session-completed', { sessionId, finalEstimation });
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