const express = require('express');
const { getConnection } = require('../config/database');
const router = express.Router();

// Get all tasks for a user
router.get('/user/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('userEmail', userEmail)
      .query(`
        SELECT TaskID, Title, Description, Status, Priority, Icon, CreatedAt, UpdatedAt
        FROM Tasks 
        WHERE UserEmail = @userEmail 
        ORDER BY UpdatedAt DESC
      `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status = 'To Do', priority = 'Medium', icon = '📚', userEmail } = req.body;
    
    if (!title || !userEmail) {
      return res.status(400).json({ error: 'Title and userEmail are required' });
    }
    
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('title', title)
      .input('description', description || '')
      .input('status', status)
      .input('priority', priority)
      .input('icon', icon)
      .input('userEmail', userEmail)
      .query(`
        INSERT INTO Tasks (Title, Description, Status, Priority, Icon, UserEmail)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @status, @priority, @icon, @userEmail)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, icon } = req.body;
    
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('taskId', taskId)
      .input('title', title)
      .input('description', description)
      .input('status', status)
      .input('priority', priority)
      .input('icon', icon)
      .query(`
        UPDATE Tasks 
        SET Title = @title, 
            Description = @description, 
            Status = @status, 
            Priority = @priority, 
            Icon = @icon, 
            UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE TaskID = @taskId
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('taskId', taskId)
      .query(`
        DELETE FROM Tasks 
        OUTPUT DELETED.*
        WHERE TaskID = @taskId
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get task statistics for a user
router.get('/stats/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('userEmail', userEmail)
      .query(`
        SELECT * FROM TaskStats WHERE UserEmail = @userEmail
      `);
    
    if (result.recordset.length === 0) {
      return res.json({
        TotalTasks: 0,
        CompletedTasks: 0,
        InProgressTasks: 0,
        ToDoTasks: 0,
        WontDoTasks: 0
      });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
});

module.exports = router;