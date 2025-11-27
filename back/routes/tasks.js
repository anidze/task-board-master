const express = require('express');
const { getConnection } = require('../config/database');

const router = express.Router();

// Helper function to get table name by status
const getTableByStatus = (status) => {
  switch (status) {
    case 'To Do': return 'ToDoTasks';
    case 'In Progress': return 'InProgressTasks';
    case "Won't do": return 'WontDoTasks';
    case 'Completed': return 'CompletedTasks';
    default: return 'ToDoTasks';
  }
};

// Helper function to get all tasks for a user across all categories
const getAllUserTasks = async (userEmail) => {
  const pool = await getConnection();
  
  const queries = [
    `SELECT TaskID, Title, Description, Priority, Icon, UserEmail, CreatedAt, UpdatedAt, 'To Do' as Status FROM ToDoTasks WHERE UserEmail = @userEmail`,
    `SELECT TaskID, Title, Description, Priority, Icon, UserEmail, CreatedAt, UpdatedAt, 'In Progress' as Status FROM InProgressTasks WHERE UserEmail = @userEmail`,
    `SELECT TaskID, Title, Description, Priority, Icon, UserEmail, CreatedAt, UpdatedAt, 'Won''t do' as Status FROM WontDoTasks WHERE UserEmail = @userEmail`,
  ];
  
  const allTasks = [];
  
  for (const query of queries) {
    const result = await pool.request()
      .input('userEmail', userEmail)
      .query(query);
    allTasks.push(...result.recordset);
  }
  
  return allTasks.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
};

// GET /api/tasks/user/:userEmail - Get all tasks for a user
router.get('/user/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const tasks = await getAllUserTasks(userEmail);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET /api/tasks/category/:status/user/:userEmail - Get tasks by category
router.get('/category/:status/user/:userEmail', async (req, res) => {
  try {
    const { status, userEmail } = req.params;
    const tableName = getTableByStatus(status);
    const pool = await getConnection();

    const result = await pool.request()
      .input('userEmail', userEmail)
      .query(`
        SELECT TaskID, Title, Description, Priority, Icon, UserEmail, CreatedAt, UpdatedAt, '${status}' as Status 
        FROM ${tableName} 
        WHERE UserEmail = @userEmail 
        ORDER BY CreatedAt DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching tasks by category:', error);
    res.status(500).json({ message: 'Error fetching tasks by category' });
  }
});

// GET /api/tasks/completed/:userEmail - Get completed tasks for a user
router.get('/completed/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input('userEmail', userEmail)
      .query(`
        SELECT TaskID, Title, Description, Priority, Icon, UserEmail, CreatedAt, CompletedAt, TimeToComplete 
        FROM CompletedTasks 
        WHERE UserEmail = @userEmail 
        ORDER BY CompletedAt DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    res.status(500).json({ message: 'Error fetching completed tasks' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status = 'To Do', priority = 'Medium', icon = '📚', userEmail } = req.body;
    
    if (!title || !userEmail) {
      return res.status(400).json({ message: 'Title and userEmail are required' });
    }

    const tableName = getTableByStatus(status);
    const pool = await getConnection();

    // Build dynamic insert query based on table
    let insertQuery = `
      INSERT INTO ${tableName} (Title, Description, Priority, Icon, UserEmail)
      OUTPUT INSERTED.*
      VALUES (@title, @description, @priority, @icon, @userEmail)
    `;

    // Add status field for dynamic status assignment
    if (tableName !== 'CompletedTasks') {
      insertQuery = `
        INSERT INTO ${tableName} (Title, Description, Priority, Icon, UserEmail)
        OUTPUT INSERTED.*, '${status}' as Status
        VALUES (@title, @description, @priority, @icon, @userEmail)
      `;
    }

    const result = await pool.request()
      .input('title', title)
      .input('description', description || '')
      .input('priority', priority)
      .input('icon', icon)
      .input('userEmail', userEmail)
      .query(insertQuery);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// PUT /api/tasks/:taskId/status - Move task between categories
router.put('/:taskId/status', async (req, res) => {
  const transaction = await (await getConnection()).transaction();
  
  try {
    await transaction.begin();
    
    const { taskId } = req.params;
    const { newStatus, currentStatus } = req.body;
    
    if (!newStatus || !currentStatus) {
      return res.status(400).json({ message: 'Both newStatus and currentStatus are required' });
    }

    const currentTable = getTableByStatus(currentStatus);
    const newTable = getTableByStatus(newStatus);

    // Get the task from current table
    const getTask = await transaction.request()
      .input('taskId', taskId)
      .query(`SELECT * FROM ${currentTable} WHERE TaskID = @taskId`);

    if (getTask.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = getTask.recordset[0];

    // If moving to completed, handle differently
    if (newStatus === 'Completed') {
      await transaction.request()
        .input('title', task.Title)
        .input('description', task.Description)
        .input('priority', task.Priority)
        .input('icon', task.Icon)
        .input('userEmail', task.UserEmail)
        .input('createdAt', task.CreatedAt)
        .query(`
          INSERT INTO CompletedTasks (Title, Description, Priority, Icon, UserEmail, CreatedAt)
          VALUES (@title, @description, @priority, @icon, @userEmail, @createdAt)
        `);
    } else {
      // Insert into new table
      await transaction.request()
        .input('title', task.Title)
        .input('description', task.Description)
        .input('priority', task.Priority)
        .input('icon', task.Icon)
        .input('userEmail', task.UserEmail)
        .input('createdAt', task.CreatedAt)
        .query(`
          INSERT INTO ${newTable} (Title, Description, Priority, Icon, UserEmail, CreatedAt)
          VALUES (@title, @description, @priority, @icon, @userEmail, @createdAt)
        `);
    }

    // Delete from current table
    await transaction.request()
      .input('taskId', taskId)
      .query(`DELETE FROM ${currentTable} WHERE TaskID = @taskId`);

    await transaction.commit();
    res.json({ message: `Task moved to ${newStatus} successfully` });

  } catch (error) {
    await transaction.rollback();
    console.error('Error moving task:', error);
    res.status(500).json({ message: 'Error moving task between categories' });
  }
});

// PUT /api/tasks/:taskId - Update task details
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, icon, status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required to update task' });
    }

    const tableName = getTableByStatus(status);
    const pool = await getConnection();

    const result = await pool.request()
      .input('taskId', taskId)
      .input('title', title)
      .input('description', description)
      .input('priority', priority)
      .input('icon', icon)
      .query(`
        UPDATE ${tableName} 
        SET Title = @title, Description = @description, Priority = @priority, 
            Icon = @icon, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*, '${status}' as Status
        WHERE TaskID = @taskId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE /api/tasks/:taskId - Delete task
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.query;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required to delete task' });
    }

    const tableName = getTableByStatus(status);
    const pool = await getConnection();

    const result = await pool.request()
      .input('taskId', taskId)
      .query(`DELETE FROM ${tableName} WHERE TaskID = @taskId`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// GET /api/tasks/stats/:userEmail - Get task statistics
router.get('/stats/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input('userEmail', userEmail)
      .query('SELECT * FROM TaskStats WHERE UserEmail = @userEmail');

    if (result.recordset.length === 0) {
      // Return default stats if user not found
      return res.json({
        UserName: 'User',
        UserEmail: userEmail,
        ToDoTasks: 0,
        InProgressTasks: 0,
        WontDoTasks: 0,
        CompletedTasks: 0,
        TotalTasks: 0,
        AvgCompletionTimeHours: 0
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
});

module.exports = router;