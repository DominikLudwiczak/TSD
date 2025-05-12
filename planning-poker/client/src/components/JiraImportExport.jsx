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
      setError('Please select a file to import');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('jiraFile', file);
      formData.append('sessionId', sessionId);

      const response = await axios.post('/api/jira/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage(`Successfully imported ${response.data.userStories.length} user stories`);
      if (onImportSuccess) {
        onImportSuccess(response.data.userStories);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import from JIRA');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      // Użyj window.open do pobrania pliku
      window.open(`/api/jira/export/${sessionId}`, '_blank');
    } catch (err) {
      setError('Failed to export to JIRA');
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
          {isUploading ? 'Importing...' : 'Import User Stories'}
        </button>
      </div>

      <div className="export-section">
        <h4>Export to JIRA</h4>
        <button onClick={handleExport}>
          Export User Stories
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default JiraImportExport;