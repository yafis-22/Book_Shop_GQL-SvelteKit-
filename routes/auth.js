import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// User data file path
const userDataPath = path.join(__dirname, '../data/userData.json');
const secretKey = process.env.JWT_SECRET_KEY; 

// Route to authenticate user (login)
router.post('/login', async (req, res) => {
  try {
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    // Get user details from the request body
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find((user) => user.username === username);

    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error authenticating user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
