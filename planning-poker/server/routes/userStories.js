// server/routes/userStories.js
const express = require('express');
const router = express.Router();
const UserStory = require('../models/UserStory');
const { body } = require('express-validator');
const userStoryController = require('../controllers/userStoryController');
const { auth, optionalAuth } = require('../middleware/auth');

// Pobierz wszystkie historie dla danego pokoju
router.get('/room/:roomId', async (req, res) => {
  try {
    const stories = await UserStory.find({ room: req.params.roomId });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validation middlewares
const taskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Task title must be less than 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Task description must be less than 1000 characters'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),
  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated hours must be a positive number'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

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

// Istniejące routes
router.get('/room/:roomId', async (req, res) => {
  try {
    const stories = await UserStory.find({ room: req.params.roomId })
      .populate('tasks.assignedTo', 'username displayName avatar')
      .populate('assignedTo', 'username displayName avatar')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', optionalAuth, async (req, res) => {
  try {
    const story = new UserStory(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// NOWE ROUTES - Task management
router.get('/:storyId', userStoryController.getUserStoryWithTasks);
router.post('/:storyId/tasks', optionalAuth, taskValidation, userStoryController.addTask);
router.put('/:storyId/tasks/:taskId', optionalAuth, userStoryController.updateTask);
router.delete('/:storyId/tasks/:taskId', optionalAuth, userStoryController.removeTask);
router.put('/:storyId/tasks/:taskId/assign', optionalAuth, userStoryController.assignTask);
router.put('/:storyId/tasks/:taskId/unassign', optionalAuth, userStoryController.unassignTask);

// Route do pobierania zadań użytkownika
router.get('/user/:userId/tasks', userStoryController.getUserTasks);

module.exports = router;

