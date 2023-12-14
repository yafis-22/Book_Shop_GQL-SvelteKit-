import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import isAdmin from '../middlewares/authMiddleware.js';


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

// Route to add a new book (only accessible by admin)
router.post('/add', isAdmin, async (req, res) => {
    try {
      const booksData = await fs.readFile(booksDataPath, 'utf8');
      const books = JSON.parse(booksData);
  
      // Get book details from the request body
      const { title, description, lendingPrice, quantity } = req.body;
  
      // Create a new book object
      const newBook = {
        id: books.length + 1,
        title,
        description,
        lendingPrice,
        quantity,
      };
  
      // Add the new book to the array
      books.push(newBook);
  
      // Write the updated book data back to booksData.json
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));
  
      res.json(newBook);
    } catch (err) {
      console.error('Error adding new book:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  export default router;