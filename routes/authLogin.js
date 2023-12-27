import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userModel from '../models/userModal.js';
import 'dotenv/config';

const router = express.Router();

const secretKey = process.env.JWT_SECRET_KEY; 

// Route to authenticate user (login)
router.post('/', async (req, res) => {
  try {
    const users = await userModel.getUsers();

    // Get user details from the request body
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find((user) => user.username === username);

    if (user && !user.deleted && await bcrypt.compare(password, user.password)) {
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
