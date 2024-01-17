import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/userModal.js';
import { Admin } from '../models/adminModal.js';
import fs from 'fs';

const router = express.Router();

// Read the configuration from JSON file
const configFile = 'config.json';
const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

const secretKey = config.JWT_SECRET_KEY;

// Route to authenticate user (login)
router.post('/', async (req, res) => {
  try {
    // Get user details from the request body
    const { username, password } = req.body;

    // Find the user by username in regular users
    const user = await User.findOne({ where: { username } });

    if (user && !user.deleted && (await bcrypt.compare(password, user.password))) {
      // Generate a JWT token for regular users
      const userToken = jwt.sign({ id: user.id, username: user.username, role: 'user' }, secretKey, { expiresIn: '1h' });

      res.json({ message: 'Login successful as user', userToken });
    } else {
      // If the user is not found in regular users, check in admin users
      const adminUser = await Admin.findOne({ where: { username } });

      if (adminUser && (await bcrypt.compare(password, adminUser.password))) {
        // Generate a JWT token for admin users
        const adminToken = jwt.sign({ id: adminUser.id, username: adminUser.username, role: 'admin' }, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Login successful as admin', adminToken });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  } catch (err) {
    console.error('Error authenticating user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
