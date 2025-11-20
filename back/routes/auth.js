const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const pool = await getConnection();
    
    // Check if email already exists
    const checkEmail = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT Email FROM Register_Tab WHERE Email = @email');
    
    if (checkEmail.recordset.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Insert new user
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('INSERT INTO Register_Tab (FullName, Email, Password) OUTPUT INSERTED.* VALUES (@fullName, @email, @password)');
    
    // Don't send password back
    const user = result.recordset[0];
    delete user.Password;
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: err.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT FullName, Email FROM Register_Tab WHERE Email = @email AND Password = @password');
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Login successful',
      user: result.recordset[0]
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: err.message 
    });
  }
});

// Get all users (for testing - remove in production)
router.get('/users', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT FullName, Email FROM Register_Tab');
    
    res.json({ 
      success: true, 
      users: result.recordset 
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: err.message 
    });
  }
});

module.exports = router;
