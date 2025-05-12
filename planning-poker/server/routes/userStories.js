// server/routes/userStories.js
const express = require('express');
const router = express.Router();
const UserStory = require('../models/UserStory');

// Pobierz wszystkie historie dla danego pokoju
router.get('/room/:roomId', async (req, res) => {
  try {
    const stories = await UserStory.find({ room: req.params.roomId });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dodaj nową historię
router.post('/', async (req, res) => {
  try {
    const story = new UserStory(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Pozostałe endpointy CRUD...

module.exports = router;