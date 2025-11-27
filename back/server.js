const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test database connection on startup
(async () => {
  try {
    await getConnection();
  } catch (err) {
    console.error('Failed to connect to database on startup:', err.message);
  }
})();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Task Board API is running' });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT @@VERSION AS version');
    res.json({ 
      success: true, 
      message: 'Database connected successfully',
      version: result.recordset[0].version
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: err.message 
    });
  }
});

// Example: Get all tasks (you'll need to create the tasks table)
app.get('/api/tasks', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM tasks');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const pool = await getConnection();
    const result = await pool.request()
      .input('title', title)
      .input('description', description)
      .input('status', status || 'pending')
      .query('INSERT INTO tasks (title, description, status) OUTPUT INSERTED.* VALUES (@title, @description, @status)');
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
