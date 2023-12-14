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

// Get all books
router.get('/', async (req, res) => {
  try {
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    res.json(JSON.parse(booksData));
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a book by ID
router.get('/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const books = JSON.parse(booksData);

    const book = books.find((book) => book.id === bookId);

    if (book) {
      res.json({ message: 'Book retrieved successfully', data: book });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new book (only accessible by admin)
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
  
      books.push(newBook);
  
      // Write the updated book data back to booksData.json
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));
  
      res.json({ message: 'Book added successfully', data: newBook });
    } catch (err) {
      console.error('Error adding new book:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Update a book (only accessible by admin)
router.put('/:id', isAdmin, async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    let books = JSON.parse(booksData);

    // Find the index of the book by ID
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      // Update the book details from the request body
      const { title, description, lendingPrice, quantity } = req.body;

      // Update the book object
      books[bookIndex] = {
        ...books[bookIndex],
        title,
        description,
        lendingPrice,
        quantity,
      };

      // Write the updated book data back to booksData.json
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

      res.json({ message: 'Book updated successfully', data: books[bookIndex] });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a book (only accessible by admin)
router.delete('/:id', isAdmin, async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    let books = JSON.parse(booksData);

    // Find the index of the book by ID
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      // Remove the book from the array
      const deletedBook = books.splice(bookIndex, 1)[0];

      // Write the updated book data back to booksData.json
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

      res.json({ message: 'Book deleted successfully', data: deletedBook });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;