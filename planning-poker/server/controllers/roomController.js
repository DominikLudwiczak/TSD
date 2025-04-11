// server/controllers/roomController.js
const roomService = require('../services/roomService');

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Retrieve a list of all rooms, optionally only active ones
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: If true, only return active rooms
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Server error
 */
const getAllRooms = async (req, res) => {
  try {
    const activeOnly = req.query.active === 'true';
    const rooms = await roomService.getAllRooms(activeOnly);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     description: Retrieve a specific room by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    room ? res.json(room) : res.status(404).json({ error: 'Room not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     description: Create a new planning poker room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - creator
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               creator:
 *                 type: string
 *                 description: User ID of the creator
 *               deckType:
 *                 type: string
 *                 enum: [fibonacci, tshirt, custom]
 *               settings:
 *                 type: object
 *                 properties:
 *                   showAverage:
 *                     type: boolean
 *                   moderatorCanReveal:
 *                     type: boolean
 *                   observersCanSeeCards:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: Room created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const createRoom = async (req, res) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room
 *     description: Update an existing room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               deckType:
 *                 type: string
 *                 enum: [fibonacci, tshirt, custom]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    res.json(updatedRoom);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms/{id}/participants:
 *   post:
 *     summary: Add participant to room
 *     description: Add a new participant to a room
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID
 *               role:
 *                 type: string
 *                 enum: [developer, observer, moderator]
 *                 default: developer
 *     responses:
 *       200:
 *         description: Updated room with new participant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
const addParticipant = async (req, res) => {
  try {
    const room = await roomService.addParticipant(req.params.id, req.body);
    res.json(room);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms/{roomId}/participants/{userId}:
 *   delete:
 *     summary: Remove participant from room
 *     description: Mark a participant as inactive in a room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Updated room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room or user not found
 *       500:
 *         description: Server error
 */
const removeParticipant = async (req, res) => {
  try {
    const room = await roomService.removeParticipant(req.params.roomId, req.params.userId);
    res.json(room);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms/{id}/settings:
 *   put:
 *     summary: Update room settings
 *     description: Update the settings for a specific room
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showAverage:
 *                 type: boolean
 *               moderatorCanReveal:
 *                 type: boolean
 *               observersCanSeeCards:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated room settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
const updateRoomSettings = async (req, res) => {
  try {
    const room = await roomService.updateRoomSettings(req.params.id, req.body);
    res.json(room);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: Delete a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       204:
 *         description: Room deleted
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(204).end();
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  addParticipant,
  removeParticipant,
  updateRoomSettings,
  deleteRoom
};