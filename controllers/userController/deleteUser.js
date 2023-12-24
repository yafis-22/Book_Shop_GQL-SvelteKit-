import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteUser = async (req, res) => {
    try {
      // Fetch user ID from the authenticated user's token
      const requestingUserId = req.login.id;
  
      // Read user data from userData.json
      const userDataPath = path.join(__dirname, '../../data/userData.json');
      const userData = await fs.readFile(userDataPath, 'utf8');
      let users = JSON.parse(userData);
  
      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === requestingUserId);
  
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = users[userIndex];
  
      if (user.id !== requestingUserId) {
        return res.status(403).json({ message: 'Permission denied. You can only delete your own profile.' });
      }
  
      // Remove the user from the array
      const deletedUser = users.splice(userIndex, 1)[0];
  
      // Write the updated user data back to userData.json
      await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
  
      res.json({ message: 'User deleted successfully', data: deletedUser });
    } catch (err) {
      console.error('Error deleting User:', err);
      res.status(500).send('Internal Server Error');
    }
  };
  