// server/routes/index.js
const express = require('express');
const router = express.Router();

const cardRoutes = require('./cards');
const roomRoutes = require('./rooms');
const userRoutes = require('./users');
const sessionRoutes = require('./sessions');
const jiraRouter = require('./jira'); // Dodaj nowy router

// Register all routes
router.use('/cards', cardRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/jira', jiraRouter); // Dodaj nowy router

// Base route
router.get('/', (req, res) => {
  res.json({ message: 'Planning Poker API is running' });
});

// Sprawdź, czy te moduły istnieją
try {
  const cardsRouter = require('./cards');
  router.use('/cards', cardsRouter);
} catch (error) {
  console.error('Error loading cards router:', error);
}

try {
  const roomsRouter = require('./rooms');
  router.use('/rooms', roomsRouter);
} catch (error) {
  console.error('Error loading rooms router:', error);
}

try {
  const sessionsRouter = require('./sessions');
  router.use('/sessions', sessionsRouter);
} catch (error) {
  console.error('Error loading sessions router:', error);
}

try {
  const usersRouter = require('./users');
  router.use('/users', usersRouter);
} catch (error) {
  console.error('Error loading users router:', error);
}

module.exports = router;