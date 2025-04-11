// server/controllers/estimationSessionController.js
const estimationSessionService = require('../services/estimationSessionService');

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new estimation session
 *     description: Create a new estimation session in a room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room
 *             properties:
 *               room:
 *                 type: string
 *                 description: Room ID
 *               taskName:
 *                 type: string
 *               taskDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const createSession = async (req, res) => {
  try {
    const newSession = await estimationSessionService.createSession(req.body);
    res.status(201).json(newSession);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/room/{roomId}:
 *   get:
 *     summary: Get all sessions for a room
 *     description: Retrieve all estimation sessions for a specific room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: A list of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstimationSession'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
const getSessionsByRoom = async (req, res) => {
  try {
    const sessions = await estimationSessionService.getSessionsByRoom(req.params.roomId);
    res.json(sessions);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get estimation session by ID
 *     description: Retrieve a specific estimation session by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const getSessionById = async (req, res) => {
  try {
    const session = await estimationSessionService.getSessionById(req.params.id);
    session ? res.json(session) : res.status(404).json({ error: 'Session not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}/estimation:
 *   post:
 *     summary: Add an estimation to the session
 *     description: Add or update a user's card estimation in a session
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - cardId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               cardId:
 *                 type: string
 *                 description: Card ID
 *     responses:
 *       200:
 *         description: Updated session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       400:
 *         description: Invalid input or session not active
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const addEstimation = async (req, res) => {
  try {
    const session = await estimationSessionService.addEstimation(
      req.params.id,
      req.body.userId,
      req.body.cardId
    );
    res.json(session);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('Cannot add estimation')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}/reveal:
 *   post:
 *     summary: Reveal estimations
 *     description: Reveal all estimations in a session
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session with revealed estimations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       400:
 *         description: Session is already revealed or completed
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const revealEstimations = async (req, res) => {
  try {
    const session = await estimationSessionService.revealEstimations(req.params.id);
    res.json(session);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('already revealed')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}/reset:
 *   post:
 *     summary: Reset session
 *     description: Reset a session to active state and clear estimations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID of the person resetting the session
 *     responses:
 *       200:
 *         description: Reset session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const resetSession = async (req, res) => {
  try {
    const session = await estimationSessionService.resetSession(
      req.params.id,
      req.body.userId
    );
    res.json(session);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}/complete:
 *   post:
 *     summary: Complete session
 *     description: Complete a session and set final estimation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: Card ID for final estimation
 *     responses:
 *       200:
 *         description: Completed session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       400:
 *         description: Session is already completed
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const completeSession = async (req, res) => {
  try {
    const session = await estimationSessionService.completeSession(
      req.params.id,
      req.body.cardId
    );
    res.json(session);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('already completed')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}/notes:
 *   put:
 *     summary: Add notes to session
 *     description: Add or update notes for a session
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Notes text
 *     responses:
 *       200:
 *         description: Session with updated notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstimationSession'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const addSessionNotes = async (req, res) => {
  try {
    const session = await estimationSessionService.addSessionNotes(
      req.params.id,
      req.body.notes
    );
    res.json(session);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     description: Delete a session by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       204:
 *         description: Session deleted
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
const deleteSession = async (req, res) => {
  try {
    await estimationSessionService.deleteSession(req.params.id);
    res.status(204).end();
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSession,
  getSessionsByRoom,
  getSessionById,
  addEstimation,
  revealEstimations,
  resetSession,
  completeSession,
  addSessionNotes,
  deleteSession
};