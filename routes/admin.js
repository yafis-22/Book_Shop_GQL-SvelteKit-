import express from 'express';
import { isAdmin } from '../middlewares/authMiddleware.js';
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

export default router;
