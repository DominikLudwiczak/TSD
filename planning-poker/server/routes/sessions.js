const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/estimationSessionController');

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new estimation session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room:
 *                 type: string
 *                 description: Room ID
 *               taskName:
 *                 type: string
 *                 description: Task name
 *               taskDescription:
 *                 type: string
 *                 description: Task description
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       400:
 *         description: Bad Request
 */
router.post('/', sessionController.createSession);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get an estimation session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Session ID
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
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', sessionController.getSessionById);

/**
 * @swagger
 * /sessions/{id}/estimation:
 *   post:
 *     summary: Add an estimation to the session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Session ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               cardId:
 *                 type: string
 *                 description: Card ID
 *     responses:
 *       200:
 *         description: Estimation added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/:id/estimation', sessionController.addEstimation);

/**
 * @swagger
 * /sessions/{id}/reveal:
 *   post:
 *     summary: Reveal the estimations of a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Session ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estimations revealed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       500:
 *         description: Internal Server Error
 */
router.post('/:id/reveal', sessionController.revealEstimations);

/**
 * @swagger
 * /sessions/{id}/complete:
 *   post:
 *     summary: Complete the estimation session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Session ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: Final card selected for the session
 *     responses:
 *       200:
 *         description: Session completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       500:
 *         description: Internal Server Error
 */
router.post('/:id/complete', sessionController.completeSession);

module.exports = router;
