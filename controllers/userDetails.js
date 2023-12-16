import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const userDetails = async (req, res) => {
  try {
    const userDataPath = path.join(__dirname, '../data/userData.json');

    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

    // Read user data
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    // Find the user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send only the user's details
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      lentBooks: user.lentBooks
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).send('Internal Server Error');
  }
};
