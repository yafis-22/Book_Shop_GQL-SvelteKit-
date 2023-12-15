import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Admin data file path
const adminDataPath = path.join(__dirname, '../admin/adminData.json');

// Books data file path
const booksDataPath = path.join(__dirname, '../admin/booksData.json');

// Admin routes
router.get('/', isAdmin, async (req, res) => {
  try {
    // Read admin data from adminData.json
    const adminData = await fs.readFile(adminDataPath, 'utf8');
    res.json(JSON.parse(adminData));
  } catch (err) {
    console.error('Error reading admin data:', err);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
