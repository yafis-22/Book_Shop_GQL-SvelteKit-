import express from 'express';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';
import { registerUser } from '../controllers/userController/registerUser.js';
import { userDetails } from '../controllers/userController/userDetails.js';
import { deleteUser } from '../controllers/userController/deleteUser.js';
import { getAllUsers, getUserById } from '../controllers/userController/getUser.js';
import { updateUser } from '../controllers/userController/updateUser.js';
import { activateUser } from '../controllers/userController/activateUser.js';

const router = express.Router();

// Register a new user
router.post('/', registerUser);

// Fetch user details (only particular user who sign in)
router.get('/me', authenticateUser, userDetails);

// Delete user (only particular user who sign in)
router.delete('/me', authenticateUser, deleteUser);

// User routes (only by Admin)
router.get('/', isAdmin, getAllUsers);

// Get a user by ID (only By Admin)
router.get('/:id', isAdmin, getUserById);

// Update user
router.put('/me', authenticateUser, updateUser);

// Activate user
router.put('/:id/activate', isAdmin, activateUser);
export default router;
