import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Books data file path
const booksDataPath = path.join(__dirname, '../admin/booksData.json');

// Route to get all books
router.get('/', async (req, res) => {
  try {
    // Read books data from booksData.json
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    res.json(JSON.parse(booksData));
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get a book by ID
router.get('/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    // Read books data from booksData.json
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const books = JSON.parse(booksData);

    // Find the book by ID
    const book = books.find((book) => book.id === bookId);

    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
