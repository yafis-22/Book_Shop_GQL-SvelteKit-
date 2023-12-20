import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';
import { registerUser } from '../controllers/registerUser.js';
import { userDetails } from '../controllers/userDetails.js';
import { deleteUser } from '../controllers/deleteUser.js';


const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// User data file path
const userDataPath = path.join(__dirname, '../data/userData.json');

// Register a new user
router.post('/register', registerUser);

// Fetch user details (only particular user who sign in)
router.get('/', authenticateUser, userDetails);

// Delete user (only particular user who sign in)
router.delete('/delete', authenticateUser, deleteUser);

// User routes (only accessible by Admin)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const { username } = req.query;

    // Read user data from userData.json
    const userData = await fs.readFile(userDataPath, 'utf8');
    let allUsers = JSON.parse(userData);

    if (username) {
      allUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(username.toLowerCase())
      );
    }
    res.json({
      message: 'All users retrieved successfully',
      users: allUsers,
    });
  } catch (err) {
    console.error('Error reading user data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a user by ID (only By Admin)
router.get('/all/:id', isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    // Find the user by ID
    const user = users.find((user) => user.id === userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error reading user data:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
