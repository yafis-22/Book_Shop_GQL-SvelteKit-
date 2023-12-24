import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userDataPath = path.join(__dirname, '../../data/userData.json');
const userData = await fs.readFile(userDataPath, 'utf8');

export const getAllUsers = async (req, res) => {
    try {
      const { username } = req.query;
  
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
  };
  
export const getUserById = async (req, res) => {

    const userId = parseInt(req.params.id);
  
    try {
      const users = JSON.parse(userData);
  
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
  };