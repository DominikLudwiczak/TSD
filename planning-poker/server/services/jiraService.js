// server/services/jiraService.js
const fs = require('fs');
const path = require('path');

class JiraService {
  /**
   * Import user stories from JIRA JSON/CSV export
   */
  importFromJira(fileContent, fileName) {
    try {
      // Sprawdź typ pliku (CSV lub JSON) na podstawie rozszerzenia
      const isJSON = fileName.toLowerCase().endsWith('.json');
      const isCSV = fileName.toLowerCase().endsWith('.csv');
      
      if (isJSON) {
        return this.parseJiraJSON(fileContent);
      } else if (isCSV) {
        return this.parseJiraCSV(fileContent);
      } else {
        throw new Error('Niewspierany format pliku. Akceptujemy tylko .json i .csv');
      }
    } catch (error) {
      console.error('Błąd parsowania importu JIRA:', error);
      throw new Error(`Nieprawidłowy format pliku JIRA: ${error.message}`);
    }
  }

  /**
   * Parse JIRA JSON export
   */
  parseJiraJSON(fileContent) {
    // Próbujemy sparsować jako JSON
    const jiraData = JSON.parse(fileContent.toString());
    
    // Sprawdzamy czy to jest format JIRA
    if (jiraData.issues || Array.isArray(jiraData)) {
      const issues = jiraData.issues || jiraData;
      
      // Mapowanie danych z JIRA do formatu naszej aplikacji
      return issues.map((issue, index) => ({
        id: `story-${Date.now()}-${index}`, // Generujemy unikalne ID
        title: issue.fields?.summary || issue.summary || 'Bez tytułu',
        description: issue.fields?.description || issue.description || '',
        status: this.mapJiraStatus(issue.fields?.status?.name || issue.status || 'To Do'),
        jiraId: issue.key || issue.id || null,
        // Dodatkowe pola
        tasks: (issue.fields?.subtasks || issue.subtasks || []).map((subtask, taskIndex) => ({
          id: `task-${Date.now()}-${index}-${taskIndex}`, // Generujemy unikalne ID
          title: subtask.fields?.summary || subtask.summary || 'Bez tytułu',
          description: subtask.fields?.description || subtask.description || '',
          status: this.mapJiraStatus(subtask.fields?.status?.name || subtask.status || 'To Do')
        }))
      }));
    } else {
      throw new Error('Plik JSON nie jest w oczekiwanym formacie JIRA');
    }
  }

  /**
   * Parse JIRA CSV export
   */
  parseJiraCSV(fileContent) {
    const csvString = fileContent.toString();
    const lines = csvString.split('\n');
    
    if (lines.length < 2) {
      throw new Error('Plik CSV jest pusty lub zawiera tylko nagłówki');
    }
    
    // Wyodrębnienie nazw kolumn z pierwszej linii
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Znajdź indeksy ważnych kolumn
    const summaryIndex = headers.indexOf('summary');
    const descriptionIndex = headers.indexOf('description');
    const statusIndex = headers.indexOf('status');
    const keyIndex = headers.indexOf('issue key');
    
    if (summaryIndex === -1) {
      throw new Error('Plik CSV nie zawiera kolumny "Summary"');
    }
    
    // Parsowanie wierszy
    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = this.parseCSVLine(line);
        
        return {
          id: `story-${Date.now()}-${index}`, // Generujemy unikalne ID
          title: values[summaryIndex] || 'Bez tytułu',
          description: descriptionIndex !== -1 ? values[descriptionIndex] || '' : '',
          status: statusIndex !== -1 ? this.mapJiraStatus(values[statusIndex]) : 'todo',
          jiraId: keyIndex !== -1 ? values[keyIndex] : null,
          tasks: [] // W podstawowym CSV nie ma informacji o subtaskach
        };
      });
  }
  
  /**
   * Parse a CSV line while handling quoted values
   */
  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Dodaj ostatnią wartość
    values.push(current.trim());
    
    return values;
  }

  /**
   * Export user stories to JIRA compatible format
   */
  exportToJira(userStories) {
    try {
      // Mapowanie naszych danych do formatu JIRA
      const jiraData = {
        issues: userStories.map((story, index) => {
          const storyKey = story.jiraId || `STORY-${index + 1}`;
          
          return {
            key: storyKey,
            fields: {
              summary: story.title,
              description: story.description,
              status: { name: this.mapToJiraStatus(story.status) },
              customfield_10001: story.finalEstimation || null, // Estymacja
              subtasks: (story.tasks || []).map((task, taskIndex) => ({
                key: task.jiraId || `${storyKey}-${taskIndex + 1}`,
                fields: {
                  summary: task.title,
                  description: task.description || '',
                  status: { name: this.mapToJiraStatus(task.status || 'todo') }
                }
              }))
            }
          };
        })
      };
      
      return JSON.stringify(jiraData, null, 2);
    } catch (error) {
      console.error('Błąd tworzenia eksportu JIRA:', error);
      throw new Error('Nie udało się stworzyć eksportu JIRA');
    }
  }

  /**
   * Map JIRA status to our application status
   */
  mapJiraStatus(jiraStatus) {
    if (!jiraStatus) return 'todo';
    
    const statusMap = {
      'to do': 'todo',
      'in progress': 'inProgress',
      'done': 'done',
      'w toku': 'inProgress',
      'do zrobienia': 'todo',
      'zrobione': 'done'
    };
    
    const normalizedStatus = String(jiraStatus).toLowerCase();
    return statusMap[normalizedStatus] || 'todo';
  }

  /**
   * Map our application status to JIRA status
   */
  mapToJiraStatus(appStatus) {
    if (!appStatus) return 'To Do';
    
    const statusMap = {
      'todo': 'To Do',
      'inProgress': 'In Progress',
      'done': 'Done'
    };
    
    return statusMap[appStatus] || 'To Do';
  }
}

module.exports = new JiraService();