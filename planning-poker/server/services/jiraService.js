// server/services/jiraService.js
const fs = require('fs');
const path = require('path');

class JiraService {
  /**
   * Import user stories from JIRA CSV export
   * @param {Buffer|string} fileContent - Content of the imported JIRA file
   * @returns {Array} - Array of user stories ready to be saved to database
   */
  importFromJira(fileContent) {
    try {
      // Zakładamy, że otrzymujemy JSON z JIRA
      const jiraData = JSON.parse(fileContent.toString());
      
      // Mapowanie danych z JIRA do formatu naszej aplikacji
      const userStories = jiraData.issues.map(issue => ({
        title: issue.fields.summary,
        description: issue.fields.description || '',
        status: this.mapJiraStatus(issue.fields.status.name),
        // Mapowanie zadań jeśli istnieją
        tasks: issue.fields.subtasks?.map(subtask => ({
          title: subtask.fields.summary,
          description: subtask.fields.description || '',
          status: this.mapJiraStatus(subtask.fields.status.name)
        })) || [],
        // Dodatkowe pola z JIRA, które mogą być przydatne
        jiraId: issue.key,
        jiraUrl: issue.self
      }));
      
      return userStories;
    } catch (error) {
      console.error('Error parsing JIRA import:', error);
      throw new Error('Invalid JIRA file format');
    }
  }

  /**
   * Export user stories to JIRA compatible format
   * @param {Array} userStories - Array of user stories with tasks and estimations
   * @returns {string} - JSON string ready to be imported to JIRA
   */
  exportToJira(userStories) {
    try {
      // Mapowanie naszych danych do formatu JIRA
      const jiraData = {
        issues: userStories.map((story, index) => ({
          key: story.jiraId || `STORY-${index + 1}`,
          fields: {
            summary: story.title,
            description: story.description,
            status: { name: this.mapToJiraStatus(story.status) },
            // Dodajemy informację o estymacji w polach niestandardowych
            customfield_10001: story.estimation || null,
            subtasks: story.tasks.map((task, taskIndex) => ({
              key: task.jiraId || `TASK-${index + 1}-${taskIndex + 1}`,
              fields: {
                summary: task.title,
                description: task.description,
                status: { name: this.mapToJiraStatus(task.status) }
              }
            }))
          }
        }))
      };
      
      return JSON.stringify(jiraData, null, 2);
    } catch (error) {
      console.error('Error creating JIRA export:', error);
      throw new Error('Failed to create JIRA export');
    }
  }

  /**
   * Map JIRA status to our application status
   */
  mapJiraStatus(jiraStatus) {
    const statusMap = {
      'To Do': 'todo',
      'In Progress': 'inProgress',
      'Done': 'done'
      // Dodaj więcej mapowań statusów w razie potrzeby
    };
    return statusMap[jiraStatus] || 'todo'; // Domyślnie 'todo' jeśli nie ma mapowania
  }

  /**
   * Map our application status to JIRA status
   */
  mapToJiraStatus(appStatus) {
    const statusMap = {
      'todo': 'To Do',
      'inProgress': 'In Progress',
      'done': 'Done'
      // Dodaj więcej mapowań statusów w razie potrzeby
    };
    return statusMap[appStatus] || 'To Do'; // Domyślnie 'To Do' jeśli nie ma mapowania
  }
}

module.exports = new JiraService();