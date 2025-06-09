const UserStory = require('../models/UserStory');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * /user-stories/{storyId}/tasks:
 *   post:
 *     summary: Add a task to user story
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *               estimatedHours:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Task added successfully
 *       404:
 *         description: User story not found
 */
const addTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { storyId } = req.params;
    const taskData = {
      ...req.body,
      createdBy: req.user?._id
    };

    // Znajdź user story
    const userStory = await UserStory.findById(storyId);
    if (!userStory) {
      return res.status(404).json({ error: 'User story not found' });
    }

    // Sprawdź czy użytkownik istnieje (jeśli assignedTo podano)
    if (taskData.assignedTo) {
      const assignedUser = await User.findById(taskData.assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ error: 'Assigned user not found' });
      }
    }

    // Dodaj zadanie
    const newTask = userStory.addTask(taskData);
    await userStory.save();

    // Populate assigned user info
    await userStory.populate('tasks.assignedTo', 'username displayName');

    res.status(201).json({
      message: 'Task added successfully',
      task: newTask,
      userStory: userStory
    });

  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({ error: 'Server error while adding task' });
  }
};

/**
 * @swagger
 * /user-stories/{storyId}/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, inProgress, done]
 *               assignedTo:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *               estimatedHours:
 *                 type: number
 *               actualHours:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: User story or task not found
 */
const updateTask = async (req, res) => {
  try {
    const { storyId, taskId } = req.params;
    const updateData = req.body;

    // Znajdź user story
    const userStory = await UserStory.findById(storyId);
    if (!userStory) {
      return res.status(404).json({ error: 'User story not found' });
    }

    // Znajdź zadanie
    const task = userStory.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Sprawdź czy użytkownik istnieje (jeśli assignedTo podano)
    if (updateData.assignedTo) {
      const assignedUser = await User.findById(updateData.assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ error: 'Assigned user not found' });
      }
    }

    // Aktualizuj zadanie
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        task[key] = updateData[key];
      }
    });

    await userStory.save();

    // Populate assigned user info
    await userStory.populate('tasks.assignedTo', 'username displayName');

    res.json({
      message: 'Task updated successfully',
      task: task,
      userStory: userStory
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error while updating task' });
  }
};

/**
 * @swagger
 * /user-stories/{storyId}/tasks/{taskId}:
 *   delete:
 *     summary: Remove a task from user story
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task removed successfully
 *       404:
 *         description: User story or task not found
 */
const removeTask = async (req, res) => {
  try {
    const { storyId, taskId } = req.params;

    // Znajdź user story
    const userStory = await UserStory.findById(storyId);
    if (!userStory) {
      return res.status(404).json({ error: 'User story not found' });
    }

    // Znajdź i usuń zadanie
    const task = userStory.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    userStory.removeTask(taskId);
    await userStory.save();

    res.json({
      message: 'Task removed successfully',
      userStory: userStory
    });

  } catch (error) {
    console.error('Remove task error:', error);
    res.status(500).json({ error: 'Server error while removing task' });
  }
};

/**
 * @swagger
 * /user-stories/{storyId}/tasks/{taskId}/assign:
 *   put:
 *     summary: Assign task to user
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       404:
 *         description: User story, task, or user not found
 */
const assignTask = async (req, res) => {
  try {
    const { storyId, taskId } = req.params;
    const { userId } = req.body;

    // Znajdź user story
    const userStory = await UserStory.findById(storyId);
    if (!userStory) {
      return res.status(404).json({ error: 'User story not found' });
    }

    // Znajdź zadanie
    const task = userStory.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Sprawdź czy użytkownik istnieje
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Przypisz zadanie
    task.assignedTo = userId;
    await userStory.save();

    // Populate assigned user info
    await userStory.populate('tasks.assignedTo', 'username displayName');

    res.json({
      message: 'Task assigned successfully',
      task: task,
      assignedTo: user
    });

  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ error: 'Server error while assigning task' });
  }
};

/**
 * @swagger
 * /user-stories/{storyId}/tasks/{taskId}/unassign:
 *   put:
 *     summary: Unassign task from user
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task unassigned successfully
 *       404:
 *         description: User story or task not found
 */
const unassignTask = async (req, res) => {
  try {
    const { storyId, taskId } = req.params;

    // Znajdź user story
    const userStory = await UserStory.findById(storyId);
    if (!userStory) {
      return res.status(404).json({ error: 'User story not found' });
    }

    // Znajdź zadanie
    const task = userStory.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Usuń przypisanie
    task.assignedTo = null;
    await userStory.save();

    res.json({
      message: 'Task unassigned successfully',
      task: task
    });

  } catch (error) {
    console.error('Unassign task error:', error);
    res.status(500).json({ error: 'Server error while unassigning task' });
  }
};

/**
 * @swagger
 * /user-stories/user/{userId}/tasks:
 *   get:
 *     summary: Get all tasks assigned to a user
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, inProgress, done]
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User tasks retrieved successfully
 *       404:
 *         description: User not found
 */
const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, roomId } = req.query;

    // Sprawdź czy użytkownik istnieje
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Buduj query
    const query = { 'tasks.assignedTo': userId };
    if (roomId) {
      query.room = roomId;
    }

    // Znajdź user stories z zadaniami przypisanymi do użytkownika
    const userStories = await UserStory.find(query)
      .populate('tasks.assignedTo', 'username displayName')
      .populate('assignedTo', 'username displayName')
      .sort({ createdAt: -1 });

    // Wyfiltruj tylko zadania przypisane do tego użytkownika
    const userTasks = [];
    userStories.forEach(story => {
      const assignedTasks = story.tasks.filter(task => 
        task.assignedTo && task.assignedTo._id.toString() === userId &&
        (!status || task.status === status)
      );
      
      assignedTasks.forEach(task => {
        userTasks.push({
          taskId: task._id,
          task: task,
          userStory: {
            _id: story._id,
            title: story.title,
            description: story.description,
            status: story.status,
            room: story.room
          }
        });
      });
    });

    res.json({
      user: user,
      tasks: userTasks,
      totalTasks: userTasks.length
    });

  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ error: 'Server error while getting user tasks' });
  }
};

/**
 * @swagger
 * /user-stories/{storyId}:
 *   get:
 *     summary: Get user story with tasks
 *     tags: [User Stories]
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User story retrieved successfully
 *       404:
 *         description: User story not found
 */
const getUserStoryWithTasks = async (req, res) => {
  try {
    const { storyId } = req.params;

    const userStory = await UserStory.findById(storyId)
      .populate('tasks.assignedTo', 'username displayName avatar')
      .populate('assignedTo', 'username displayName avatar')
      .populate('tasks.createdBy', 'username displayName');

    if (!userStory) {
      return res.status(404).json({ error: 'User story not found' });
    }

    res.json({
      userStory: userStory
    });

  } catch (error) {
    console.error('Get user story error:', error);
    res.status(500).json({ error: 'Server error while getting user story' });
  }
};

module.exports = {
  addTask,
  updateTask,
  removeTask,
  assignTask,
  unassignTask,
  getUserTasks,
  getUserStoryWithTasks
};