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

module.exports = router;