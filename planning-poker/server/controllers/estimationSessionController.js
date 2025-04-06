const sessionService = require('../services/estimationSessionService');

const createSession = async (req, res) => {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    session ? res.json(session) : res.status(404).json({ error: 'Session not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addEstimation = async (req, res) => {
  try {
    const updated = await sessionService.addEstimation(req.params.id, req.body.userId, req.body.cardId);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const revealEstimations = async (req, res) => {
  try {
    const session = await sessionService.revealEstimations(req.params.id);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const completeSession = async (req, res) => {
  try {
    const session = await sessionService.completeSession(req.params.id, req.body.cardId);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSession,
  getSessionById,
  addEstimation,
  revealEstimations,
  completeSession
};
