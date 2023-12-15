import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secretKey from '../routes/auth.js';

const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// User data file path
const userDataPath = path.join(__dirname, '../user/userData.json');
// Books data file path
const booksDataPath = path.join(__dirname, '../admin/booksData.json');

// User routes
router.get('/', async (req, res) => {
  try {
    // Read user data from userData.json
    const userData = await fs.readFile(userDataPath, 'utf8');
    res.json(JSON.parse(userData));
  } catch (err) {
    console.error('Error reading user data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    const { username, password, email } = req.body;

    // Check if the username or email is already taken
    const isUsernameTaken = users.some((user) => user.username === username);
    const isEmailTaken = users.some((user) => user.email === email);
    if (isUsernameTaken || isEmailTaken) {
      return res.status(400).json({ message: 'Username or email is already taken' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      email,
    };

    users.push(newUser);

    // Write the updated user data back to userData.json
    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
    res.json({ message: 'New user is registered', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    // Find the user by ID
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
});

// Lend a book
router.post('/lend', async (req, res) => {
  try {
    const { userId, bookId, days } = req.body;

    // Read user data from userData.json
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    // Find the user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Read books data from booksData.json
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const books = JSON.parse(booksData);

    // Find the book by ID
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is available
    if (book.quantity <= 0) {
      return res.status(400).json({ message: 'Book not available for lending' });
    }

    // Calculate charges
    const lendingPrice = book.lendingPrice;
    const initialCharge = lendingPrice * days;
    const additionalCharge = days > 10 ? 5 * (days - 10) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Update user data (assuming you have a field like "lentBooks" in the user schema)
    user.lentBooks.push({
      bookId,
      days,
      totalCharge,
      timestamp: new Date().toISOString(),
    });

    // Update book data
    book.quantity--;

    // Write the updated data back to userData.json and booksData.json
    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
    await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

    res.json({
      message: 'Book lent successfully',
      chargeDetails: {
        initialCharge,
        additionalCharge,
        totalCharge,
      },
    });
  } catch (err) {
    console.error('Error lending book:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
