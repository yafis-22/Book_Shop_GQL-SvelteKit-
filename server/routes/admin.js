// Backend file
import express from 'express';
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';
import { Admin } from '../models/adminModal.js';

const router = express.Router();

// Admin routes
router.get('/', isAdmin, async (req, res) => {
  try {
    // Fetch all admin users using Sequelize
    const adminUsers = await Admin.findAll();

    if (adminUsers.length > 0) {
      res.json(adminUsers);
    } else {
      res.status(404).send('Admin data not found');
    }
  } catch (err) {
    console.error('Error reading admin data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch details of the currently authenticated admin
router.get('/me', authenticateUser, async (req, res) => {
  try {
    // Fetch admin ID from the authenticated user's token
    const adminId = req.login.id;

    // If the user is not an admin, disallow
    if (req.login.role !== 'admin') {
      return res.status(403).json({ message: 'Invalid Admin Token.' });
    }

    // Get admin details using Sequelize's findByPk method
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).send('Admin not found');
    }

    // Send only the admin's details
    res.json({ message: 'Admin details', data: admin });
  } catch (err) {
    console.error('Error fetching admin details:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
