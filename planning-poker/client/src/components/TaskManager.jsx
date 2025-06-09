// client/src/components/TaskManager.jsx - PEŁNY KOMPONENT
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = ({ userStory, currentUser, onUpdate }) => {
  const [tasks, setTasks] = useState(userStory?.tasks || []);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    estimatedHours: '',
    dueDate: '',
    tags: []
  });
  const [users, setUsers] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    setTasks(userStory?.tasks || []);
    fetchUsers();
  }, [userStory]);

  const fetchUsers = async () => {
    try {
      // W przyszłości zastąp rzeczywistym API do pobierania użytkowników pokoju
      // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/rooms/${userStory?.room}/users`);
      // setUsers(response.data || []);
      
      // MOCKOWE DANE na potrzeby demonstracji
      setUsers([
        { _id: 'user-1', username: 'john_doe', displayName: 'John Doe' },
        { _id: 'user-2', username: 'jane_smith', displayName: 'Jane Smith' },
        { _id: 'user-3', username: currentUser?.nickname, displayName: currentUser?.nickname || 'Ty' }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback users
      setUsers([
        { _id: 'user-current', username: currentUser?.nickname, displayName: currentUser?.nickname || 'Ty' }
      ]);
    }
  };

  const handleAddTask = async () => {
    try {
      const taskData = {
        ...newTask,
        tags: typeof newTask.tags === 'string' 
          ? newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
          : newTask.tags.filter(tag => tag.trim() !== ''),
        estimatedHours: newTask.estimatedHours ? parseFloat(newTask.estimatedHours) : null,
        dueDate: newTask.dueDate || null
      };

      // MOCKOWE DODAWANIE - w rzeczywistości użyj API
      const mockTask = {
        _id: `task-${Date.now()}`,
        ...taskData,
        status: 'todo',
        createdAt: new Date(),
        assignedTo: taskData.assignedTo ? users.find(u => u._id === taskData.assignedTo) : null
      };

      const updatedTasks = [...tasks, mockTask];
      setTasks(updatedTasks);

      // Aktualizuj user story
      const updatedStory = {
        ...userStory,
        tasks: updatedTasks
      };

      if (onUpdate) {
        onUpdate(updatedStory);
      }

      // Reset formularza
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        estimatedHours: '',
        dueDate: '',
        tags: []
      });
      setIsAddingTask(false);

      console.log('Dodano zadanie:', mockTask);

      /* 
      // RZECZYWISTE API CALL (do użycia w przyszłości):
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user-stories/${userStory._id}/tasks`,
        taskData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTasks(response.data.userStory.tasks);
      if (onUpdate) {
        onUpdate(response.data.userStory);
      }
      */

    } catch (error) {
      console.error('Error adding task:', error);
      alert('Błąd podczas dodawania zadania: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      // MOCKOWA AKTUALIZACJA
      const updatedTasks = tasks.map(task => {
        if (task._id === taskId) {
          const updatedTask = { ...task, ...updateData };
          if (updateData.assignedTo) {
            updatedTask.assignedTo = users.find(u => u._id === updateData.assignedTo) || null;
          }
          return updatedTask;
        }
        return task;
      });

      setTasks(updatedTasks);
      setEditingTask(null);

      // Aktualizuj user story
      const updatedStory = {
        ...userStory,
        tasks: updatedTasks
      };

      if (onUpdate) {
        onUpdate(updatedStory);
      }

      console.log('Zaktualizowano zadanie:', taskId, updateData);

      /* 
      // RZECZYWISTE API CALL:
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user-stories/${userStory._id}/tasks/${taskId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTasks(response.data.userStory.tasks);
      if (onUpdate) {
        onUpdate(response.data.userStory);
      }
      */

    } catch (error) {
      console.error('Error updating task:', error);
      alert('Błąd podczas aktualizacji zadania: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      return;
    }

    try {
      // MOCKOWE USUWANIE
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);

      // Aktualizuj user story
      const updatedStory = {
        ...userStory,
        tasks: updatedTasks
      };

      if (onUpdate) {
        onUpdate(updatedStory);
      }

      console.log('Usunięto zadanie:', taskId);

      /* 
      // RZECZYWISTE API CALL:
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/user-stories/${userStory._id}/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTasks(response.data.userStory.tasks);
      if (onUpdate) {
        onUpdate(response.data.userStory);
      }
      */

    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Błąd podczas usuwania zadania: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    handleUpdateTask(taskId, { assignedTo: userId });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#ffc107';
      case 'inProgress': return '#17a2b8';
      case 'done': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo': return 'Do zrobienia';
      case 'inProgress': return 'W trakcie';
      case 'done': return 'Zrobione';
      default: return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'low': return 'Niski';
      case 'medium': return 'Średni';
      case 'high': return 'Wysoki';
      case 'critical': return 'Krytyczny';
      default: return priority;
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h4>🔧 Zarządzanie zadaniami: {userStory?.title}</h4>
      
      {/* Lista zadań */}
      <div style={{ marginBottom: '20px' }}>
        {tasks.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Brak zadań</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} style={{ 
              border: '1px solid #eee', 
              padding: '15px', 
              margin: '10px 0', 
              borderRadius: '5px',
              backgroundColor: '#ffffff'
            }}>
              {editingTask === task._id ? (
                <TaskEditForm 
                  task={task}
                  users={users}
                  onSave={(updateData) => handleUpdateTask(task._id, updateData)}
                  onCancel={() => setEditingTask(null)}
                  getStatusText={getStatusText}
                  getPriorityText={getPriorityText}
                />
              ) : (
                <TaskDisplay 
                  task={task}
                  users={users}
                  onEdit={() => setEditingTask(task._id)}
                  onDelete={() => handleDeleteTask(task._id)}
                  onAssign={(userId) => handleAssignTask(task._id, userId)}
                  onStatusChange={(status) => handleUpdateTask(task._id, { status })}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  getStatusText={getStatusText}
                  getPriorityText={getPriorityText}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Przycisk dodawania zadania */}
      {!isAddingTask ? (
        <button 
          onClick={() => setIsAddingTask(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Dodaj zadanie
        </button>
      ) : (
        <TaskForm 
          task={newTask}
          users={users}
          onChange={setNewTask}
          onSave={handleAddTask}
          onCancel={() => {
            setIsAddingTask(false);
            setNewTask({
              title: '',
              description: '',
              priority: 'medium',
              assignedTo: '',
              estimatedHours: '',
              dueDate: '',
              tags: []
            });
          }}
          getStatusText={getStatusText}
          getPriorityText={getPriorityText}
        />
      )}
    </div>
  );
};

// Komponent do wyświetlania zadania
const TaskDisplay = ({ task, users, onEdit, onDelete, onAssign, onStatusChange, getStatusColor, getPriorityColor, getStatusText, getPriorityText }) => {
  const assignedUser = task.assignedTo;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <h5 style={{ margin: '0 0 5px 0' }}>{task.title}</h5>
          {task.description && (
            <p style={{ margin: '5px 0', color: '#666' }}>{task.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={onEdit} 
            style={{ 
              padding: '5px 10px', 
              fontSize: '12px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Edytuj
          </button>
          <button 
            onClick={onDelete} 
            style={{ 
              padding: '5px 10px', 
              fontSize: '12px', 
              backgroundColor: '#dc3545', 
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Usuń
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <strong>Status: </strong>
          <select 
            value={task.status} 
            onChange={(e) => onStatusChange(e.target.value)}
            style={{ 
              padding: '3px', 
              backgroundColor: getStatusColor(task.status), 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px' 
            }}
          >
            <option value="todo">Do zrobienia</option>
            <option value="inProgress">W trakcie</option>
            <option value="done">Zrobione</option>
          </select>
        </div>

        <div>
          <strong>Priorytet: </strong>
          <span style={{ 
            padding: '3px 6px', 
            backgroundColor: getPriorityColor(task.priority), 
            color: 'white', 
            borderRadius: '3px', 
            fontSize: '12px' 
          }}>
            {getPriorityText(task.priority)}
          </span>
        </div>

        <div>
          <strong>Przypisane do: </strong>
          <select 
            value={task.assignedTo?._id || task.assignedTo || ''} 
            onChange={(e) => onAssign(e.target.value || null)}
            style={{ padding: '3px' }}
          >
            <option value="">-- Nieprzypisane --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.displayName || user.username}
              </option>
            ))}
          </select>
        </div>

        {task.estimatedHours && (
          <div>
            <strong>Estymacja: </strong>{task.estimatedHours}h
          </div>
        )}

        {task.dueDate && (
          <div>
            <strong>Termin: </strong>{new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Tagi: </strong>
          {task.tags.map((tag, index) => (
            <span key={index} style={{ 
              backgroundColor: '#e9ecef', 
              padding: '2px 6px', 
              borderRadius: '3px', 
              marginRight: '5px', 
              fontSize: '12px' 
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Komponent formularza zadania
const TaskForm = ({ task, users, onChange, onSave, onCancel, isEditing = false, getStatusText, getPriorityText }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...task, [field]: value });
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim());
    onChange({ ...task, tags });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: 'white' }}>
      <h5>{isEditing ? 'Edytuj zadanie' : 'Nowe zadanie'}</h5>
      
      <div style={{ marginBottom: '10px' }}>
        <label><strong>Tytuł:</strong></label>
        <input 
          type="text"
          value={task.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Tytuł zadania"
          style={{ width: '100%', padding: '5px', marginTop: '3px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label><strong>Opis:</strong></label>
        <textarea 
          value={task.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Opis zadania"
          rows="3"
          style={{ width: '100%', padding: '5px', marginTop: '3px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label><strong>Priorytet:</strong></label>
          <select 
            value={task.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '3px' }}
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
            <option value="critical">Krytyczny</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label><strong>Przypisz do:</strong></label>
          <select 
            value={task.assignedTo}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '3px' }}
          >
            <option value="">-- Wybierz użytkownika --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.displayName || user.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label><strong>Estymacja (godziny):</strong></label>
          <input 
            type="number"
            value={task.estimatedHours}
            onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
            placeholder="np. 4"
            min="0"
            step="0.5"
            style={{ width: '100%', padding: '5px', marginTop: '3px' }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label><strong>Termin:</strong></label>
          <input 
            type="date"
            value={task.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '3px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label><strong>Tagi (oddzielone przecinkami):</strong></label>
        <input 
          type="text"
          value={Array.isArray(task.tags) ? task.tags.join(', ') : task.tags}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="frontend, api, urgent"
          style={{ width: '100%', padding: '5px', marginTop: '3px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={onSave}
          style={{
            padding: '8px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'Zapisz' : 'Dodaj zadanie'}
        </button>
        <button 
          onClick={onCancel}
          style={{
            padding: '8px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

// Komponent do edycji zadania
const TaskEditForm = ({ task, users, onSave, onCancel, getStatusText, getPriorityText }) => {
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo?._id || task.assignedTo || '',
    estimatedHours: task.estimatedHours || '',
    actualHours: task.actualHours || '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    tags: task.tags || []
  });

  return (
    <div>
      <TaskForm 
        task={editData}
        users={users}
        onChange={setEditData}
        onSave={() => onSave(editData)}
        onCancel={onCancel}
        isEditing={true}
        getStatusText={getStatusText}
        getPriorityText={getPriorityText}
      />
      
      {/* Dodatkowe pole dla statusu w trybie edycji */}
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <label><strong>Status zadania:</strong></label>
        <select 
          value={editData.status}
          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          style={{ width: '100%', padding: '5px', marginTop: '3px' }}
        >
          <option value="todo">Do zrobienia</option>
          <option value="inProgress">W trakcie</option>
          <option value="done">Zrobione</option>
        </select>
      </div>
    </div>
  );
};

export default TaskManager;