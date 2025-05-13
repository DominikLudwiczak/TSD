const express = require('express');
const router = express.Router();
const multer = require('multer');
const jiraService = require('../services/jiraService');

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
      return res.status(400).json({ error: 'Nie przesłano pliku' });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Wymagane ID sesji' });
    }

    console.log('Otrzymano plik:', req.file.originalname, 'dla sesji:', sessionId);
    
    // Import historii użytkownika z pliku JIRA
    const userStories = jiraService.importFromJira(req.file.buffer, req.file.originalname);
    console.log('Zaimportowano historie:', userStories);

    res.json({ success: true, userStories });
  } catch (error) {
    console.error('Błąd importu z JIRA:', error);
    res.status(500).json({ error: error.message || 'Błąd importu z JIRA' });
  }
});

/**
 * Export user stories to JIRA
 * GET /api/jira/export/:sessionId
 */
router.get('/export/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('Eksport JIRA dla sesji:', sessionId);
    
    // Tutaj normalnie pobierałbyś historie z bazy danych
    // Dla demonstracji używamy przykładowych danych
    const mockUserStories = [
      {
        id: "story-1",
        title: "Implementacja importu/eksportu JIRA",
        description: "Jako deweloper chcę móc importować i eksportować historie użytkownika z/do JIRA",
        status: "inProgress",
        finalEstimation: 5,
        tasks: [
          {
            id: "task-1-1",
            title: "Implementacja importu",
            description: "Zaimplementować funkcję importu danych z JIRA",
            status: "done"
          },
          {
            id: "task-1-2",
            title: "Implementacja eksportu",
            description: "Zaimplementować funkcję eksportu danych do JIRA",
            status: "todo"
          }
        ]
      },
      {
        id: "story-2",
        title: "Integracja WebSocketów",
        description: "Jako deweloper chcę, żeby aplikacja aktualizowała się w czasie rzeczywistym",
        status: "done",
        finalEstimation: 3,
        tasks: []
      }
    ];

    // Generowanie eksportu do JIRA
    const jiraExport = jiraService.exportToJira(mockUserStories);
    
    // Ustawienie nagłówków odpowiedzi
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="jira-export-${sessionId}.json"`);
    
    // Wysłanie pliku
    res.send(jiraExport);
  } catch (error) {
    console.error('Błąd eksportu do JIRA:', error);
    res.status(500).json({ error: error.message || 'Błąd eksportu do JIRA' });
  }
});

module.exports = router;