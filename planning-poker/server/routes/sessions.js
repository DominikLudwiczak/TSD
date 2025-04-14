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

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new estimation session
 *     tags: [EstimationSessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstimationSession'
 *     responses:
 *       201:
 *         description: Session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 */
router.post('/', sessionController.createSession);

/**
 * @swagger
 * /sessions/room/{roomId}:
 *   get:
 *     summary: Get all sessions for a specific room
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstimationSession'
 */
router.get('/room/:roomId', sessionController.getSessionsByRoom);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       404:
 *         description: Session not found
 */
router.get('/:id', sessionController.getSessionById);

/**
 * @swagger
 * /sessions/{id}/estimation:
 *   post:
 *     summary: Add an estimation to the session
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               card:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estimation added
 */
router.post('/:id/estimation', sessionController.addEstimation);

/**
 * @swagger
 * /sessions/{id}/reveal:
 *   post:
 *     summary: Reveal all estimations in a session
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estimations revealed
 */
router.post('/:id/reveal', sessionController.revealEstimations);

/**
 * @swagger
 * /sessions/{id}/reset:
 *   post:
 *     summary: Reset the session
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session reset
 */
router.post('/:id/reset', sessionController.resetSession);

/**
 * @swagger
 * /sessions/{id}/complete:
 *   post:
 *     summary: Complete the session
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session completed
 */
router.post('/:id/complete', sessionController.completeSession);

/**
 * @swagger
 * /sessions/{id}/notes:
 *   put:
 *     summary: Add notes to the session
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notes added
 */
router.put('/:id/notes', sessionController.addSessionNotes);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     tags: [EstimationSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Session deleted
 *       404:
 *         description: Session not found
 */
router.delete('/:id', sessionController.deleteSession);


module.exports = router;