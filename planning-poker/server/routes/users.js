// server/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

// GET /api/users/:username - Get user by username
router.get('/:username', userController.getUserByUsername);

// POST /api/users - Create a new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update a user
router.put('/:id', userController.updateUser);

// PUT /api/users/:id/activity - Update user's last activity timestamp
router.put('/:id/activity', userController.updateUserActivity);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;