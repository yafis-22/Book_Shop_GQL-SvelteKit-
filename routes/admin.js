import express from 'express';
import { isAdmin } from '../middlewares/authMiddleware.js';
import * as userModel from '../models/userModal.js';

const router = express.Router();

// Admin routes
router.get('/', isAdmin, async (req, res) => {
  try {
    // Read admin data from adminData.json
    const adminData = await userModel.getAdmins();
    if (adminData) {
      res.json(adminData);
    } else {
      res.status(404).send('Admin data not found');
    }
    
  } catch (err) {
    console.error('Error reading admin data:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
