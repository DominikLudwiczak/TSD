const roomService = require('../services/roomService');

const createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    room ? res.json(room) : res.status(404).json({ error: 'Room not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addParticipant = async (req, res) => {
  try {
    const updatedRoom = await roomService.addParticipant(req.params.id, req.body.userId);
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deactivateRoom = async (req, res) => {
  try {
    const room = await roomService.deactivateRoom(req.params.id);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRoom,
  getRoomById,
  addParticipant,
  deactivateRoom
};
