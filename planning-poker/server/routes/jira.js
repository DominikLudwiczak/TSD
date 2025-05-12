// server/routes/jira.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const jiraService = require('../services/jiraService');
const EstimationSession = require('../models/EstimationSession');
const Room = require('../models/Room');

// Konfiguracja multer do obsługi uploadu plików
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

/**
 * Import user stories from JIRA
 * POST /api/jira/import
 */
router.post('/import', upload.single('jiraFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Import user stories from JIRA file
    const userStories = jiraService.importFromJira(req.file.buffer);
    
    // Save user stories to the database
    const session = await EstimationSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Estimation session not found' });
    }

    // Dodaj historie do sesji
    session.userStories = [...(session.userStories || []), ...userStories];
    await session.save();

    res.json({ success: true, userStories });
  } catch (error) {
    console.error('Error importing from JIRA:', error);
    res.status(500).json({ error: error.message || 'Failed to import from JIRA' });
  }
});

/**
 * Export user stories to JIRA
 * GET /api/jira/export/:sessionId
 */
router.get('/export/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Pobierz sesję z historii użytkownika
    const session = await EstimationSession.findById(sessionId)
      .populate('userStories')
      .populate({
        path: 'userStories',
        populate: { path: 'tasks' }
      });
    
    if (!session) {
      return res.status(404).json({ error: 'Estimation session not found' });
    }

    // Generowanie eksportu do JIRA
    const jiraExport = jiraService.exportToJira(session.userStories);
    
    // Ustawienie nagłówków odpowiedzi
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="jira-export-${sessionId}.json"`);
    
    // Wysłanie pliku
    res.send(jiraExport);
  } catch (error) {
    console.error('Error exporting to JIRA:', error);
    res.status(500).json({ error: error.message || 'Failed to export to JIRA' });
  }
});

module.exports = router;