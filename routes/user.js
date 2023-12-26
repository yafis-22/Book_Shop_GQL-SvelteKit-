import express from 'express';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';
import { registerUser } from '../controllers/userController/registerUser.js';
import { userDetails } from '../controllers/userController/userDetails.js';
import { deleteUser } from '../controllers/userController/deleteUser.js';
import { getAllUsers, getUserById } from '../controllers/userController/getUser.js';

const router = express.Router();

// Register a new user
router.post('/', registerUser);

// Fetch user details (only particular user who sign in)
router.get('/me', authenticateUser, userDetails);

// Delete user (only particular user who sign in)
router.delete('/', authenticateUser, deleteUser);

// User routes (only by Admin)
router.get('/', isAdmin, getAllUsers);

// Get a user by ID (only By Admin)
router.get('/:id', isAdmin, getUserById);

export default router;
