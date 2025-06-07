// client/src/components/JiraImportExport.jsx
import React, { useState } from 'react';
import axios from 'axios';

const JiraImportExport = ({ sessionId, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleImport = async () => {
    if (!file) {
      setError('Wybierz plik do importu');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('Rozpoczęcie importu pliku:', file.name);
      
      const formData = new FormData();
      formData.append('jiraFile', file);
      formData.append('sessionId', sessionId);

      // Sprawdź strukturę formData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Użyj axios z pełnym URL
      const response = await axios.post(`${process.env.BACKEND_URL}/api/jira/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Odpowiedź serwera:', response.data);
      
      if (response.data.success && response.data.userStories) {
        setSuccessMessage(`Pomyślnie zaimportowano ${response.data.userStories.length} historii użytkownika`);
        if (onImportSuccess) {
          onImportSuccess(response.data.userStories);
        }
      } else {
        setError('Brak danych w odpowiedzi serwera');
      }
    } catch (err) {
      console.error('Błąd importu:', err);
      setError(err.response?.data?.error || 'Błąd importu z JIRA');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      console.log('Eksport JIRA dla sesji:', sessionId);
      window.open(`${process.env.BACKEND_URL}/api/jira/export/${sessionId}`, '_blank');
    } catch (err) {
      console.error('Błąd eksportu:', err);
      setError('Błąd eksportu do JIRA');
    }
  };

  return (
    <div className="jira-import-export">
      <h3>JIRA Import/Export</h3>
      
      <div className="import-section">
        <h4>Import from JIRA</h4>
        <div className="file-input">
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <button 
          onClick={handleImport} 
          disabled={!file || isUploading}
        >
          {isUploading ? 'Importowanie...' : 'Import User Stories'}
        </button>
      </div>

      <div className="export-section">
        <h4>Export to JIRA</h4>
        <button onClick={handleExport}>
          Export User Stories
        </button>
      </div>

      {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {successMessage && <div className="success-message" style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
    </div>
  );
};

export default JiraImportExport;