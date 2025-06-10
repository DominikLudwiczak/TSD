// server/server.js
// Dodaj na początku server.js
console.log('Starting server...');
// Najpierw importy
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
const roomParticipants = {}; // { roomId: [userId1, userId2, ...] }
// Konfiguracja zmiennych środowiskowych
dotenv.config();

// Inicjalizacja aplikacji Express
const app = express();  // Tutaj inicjalizujemy app
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['*'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  debug: true  // Włącz debugowanie socket.io
});

// Teraz możemy użyć app, bo zostało już zainicjalizowane
// Middleware do logowania żądań
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Konfiguracja CORS
app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

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

// Pamiętamy głosy per pokój
const roomVotes = {}; // { roomId: { userId: cardValue } }
// Pamiętamy historie użytkownika per pokój
const roomStories = {}; // { roomId: [userStory1, userStory2, ...] }
const roomCurrentStory = {}; // { roomId: currentStory }

// Socket.io handlers
// Socket.io handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Dołączanie do pokoju
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    
    // Inicjalizuj listę uczestników pokoju, jeśli nie istnieje
    if (!roomParticipants[roomId]) {
      roomParticipants[roomId] = [];
    }
    
    // Dodaj nowego uczestnika do listy, jeśli jeszcze nie istnieje
    if (!roomParticipants[roomId].includes(userId)) {
      roomParticipants[roomId].push(userId);
    }
    
    // Powiadom wszystkich uczestników o dołączeniu nowego
    io.to(roomId).emit('participants-updated', roomParticipants[roomId]);
    
    // Prześlij nowemu użytkownikowi aktualne głosy
    const votes = roomVotes[roomId];
    if (votes) {
      // Zamiast emitować każdy głos osobno, wyślij wszystkie naraz
      const currentVotes = Object.entries(votes).map(([userId, cardValue]) => ({
        userId,
        card: cardValue
      }));
      socket.emit('votes-updated', currentVotes);
    }
    
    // Prześlij historie i aktualną historię jeśli istnieją
    if (roomStories[roomId]) {
      socket.emit('user-stories-updated', roomStories[roomId]);
    }
    if (roomCurrentStory[roomId]) {
      socket.emit('current-story-selected', roomCurrentStory[roomId]);
    }
  });
  // Rozłączenie klienta - dodaj obsługę usuwania z listy uczestników
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Znajdź wszystkie pokoje, do których należał ten klient
    for (const roomId in roomParticipants) {
      // Znajdź użytkownika w tym pokoju
      const userIndex = roomParticipants[roomId].findIndex(userId => 
        // Tutaj potrzebujemy sposobu na powiązanie socket.id z userId
        // Na razie zostawiamy to jako przykład logiki
        userId.includes(socket.id)
      );
      
      if (userIndex !== -1) {
        // Usuń użytkownika z listy uczestników
        const userId = roomParticipants[roomId][userIndex];
        roomParticipants[roomId].splice(userIndex, 1);
        
        // Powiadom pozostałych uczestników
        io.to(roomId).emit('participants-updated', roomParticipants[roomId]);
        
        // Usuń głos tego użytkownika, jeśli istnieje
        if (roomVotes[roomId] && roomVotes[roomId][userId]) {
          delete roomVotes[roomId][userId];
          io.to(roomId).emit('votes-updated', Object.entries(roomVotes[roomId]).map(
            ([userId, cardValue]) => ({ userId, card: cardValue })
          ));
        }
      }
    }
  });

  // Wybór karty
  // Wybór karty
  socket.on('select-card', (roomId, userId, cardValue) => {
    console.log(`User ${userId} selected card ${cardValue} in room ${roomId}`);
    if (!roomVotes[roomId]) roomVotes[roomId] = {};
    roomVotes[roomId][userId] = cardValue;
    
    // Wysyłaj wszystkie aktualne głosy za każdym razem
    const currentVotes = Object.entries(roomVotes[roomId]).map(([userId, cardValue]) => ({
      userId,
      card: cardValue
    }));
    
    io.to(roomId).emit('votes-updated', currentVotes);
  });

  // Reset pojedynczego gracza
  // Reset pojedynczego gracza
  socket.on('card-reset', (roomId, userId) => {
    console.log(`User ${userId} reset their card in room ${roomId}`);
    if (roomVotes[roomId]) {
      delete roomVotes[roomId][userId];
    }
    
    // Wysyłaj aktualne głosy po resecie
    const currentVotes = Object.entries(roomVotes[roomId] || {}).map(([userId, cardValue]) => ({
      userId,
      card: cardValue
    }));
    
    io.to(roomId).emit('votes-updated', currentVotes);
    io.to(roomId).emit('card-reset-ack', userId);
  });

  // Ujawnienie kart
  socket.on('reveal-cards', (roomId, sessionId) => {
    console.log(`Revealing cards for room ${roomId}, session ${sessionId}`);
    io.to(roomId).emit('cards-revealed', sessionId);
  });

  // Reset wszystkich kart
  // Reset wszystkich kart
  socket.on('reset-all-cards', (roomId, sessionId) => {
    console.log(`Resetting all cards for room ${roomId}, session ${sessionId}`);
    if (roomVotes[roomId]) {
      roomVotes[roomId] = {};
    }
    io.to(roomId).emit('votes-updated', []);
    io.to(roomId).emit('estimation-reset', sessionId);
  });

  // Wybór bieżącej historii
  socket.on('select-current-story', (roomId, story) => {
    console.log(`Current story selected in room ${roomId}:`, story.title);
    roomCurrentStory[roomId] = story;
    io.to(roomId).emit('current-story-selected', story);
  });

  // Aktualizacja historii użytkownika
  socket.on('update-user-stories', (roomId, stories) => {
    console.log(`Updating user stories for room ${roomId}, count:`, stories.length);
    roomStories[roomId] = stories;
    io.to(roomId).emit('user-stories-updated', stories);
  });

  // Zakończenie sesji
  socket.on('complete-session', (roomId, sessionId, finalEstimation) => {
    console.log(`Session ${sessionId} completed in room ${roomId} with estimation:`, finalEstimation);
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