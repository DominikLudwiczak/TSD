// server/routes/sessions.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/estimationSessionController');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Estimation session management
 */

// POST /api/sessions - Create a new session
router.post('/', sessionController.createSession);

// GET /api/sessions/room/:roomId - Get all sessions for a room
router.get('/room/:roomId', sessionController.getSessionsByRoom);

// GET /api/sessions/:id - Get session by ID
router.get('/:id', sessionController.getSessionById);

// POST /api/sessions/:id/estimation - Add estimation to session
router.post('/:id/estimation', sessionController.addEstimation);

// POST /api/sessions/:id/reveal - Reveal estimations
router.post('/:id/reveal', sessionController.revealEstimations);

// POST /api/sessions/:id/reset - Reset session
router.post('/:id/reset', sessionController.resetSession);

// POST /api/sessions/:id/complete - Complete session
router.post('/:id/complete', sessionController.completeSession);

// PUT /api/sessions/:id/notes - Add notes to session
router.put('/:id/notes', sessionController.addSessionNotes);

// DELETE /api/sessions/:id - Delete a session
router.delete('/:id', sessionController.deleteSession);

module.exports = router;