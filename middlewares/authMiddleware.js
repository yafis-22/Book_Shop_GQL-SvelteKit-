import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adminDataPath = path.join(__dirname, '../admin/adminData.json');

const isAdmin = async (req, res, next) => {
  try {
    const adminData = await fs.readFile(adminDataPath, 'utf8');
    const admins = JSON.parse(adminData);

    // Check if the user making the request is an admin
    const isAdminUser = admins.some((admin) => admin.username === req.headers['username']);
    
    if (isAdminUser) {
      // If the user is an admin, proceed to the next middleware or route
      next();
    } else {
      res.status(403).send('Unauthorized. Only admin can perform this action.');
    }
  } catch (err) {
    console.error('Error checking admin status:', err);
    res.status(500).send('Internal Server Error');
  }
};

export default isAdmin;
