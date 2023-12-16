import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { isAdmin, authenticateUser } from '../middlewares/authMiddleware.js';
import { lendBook } from '../controllers/lendBook.js';
import { addBook } from '../controllers/addBook.js';
import { updateBook } from '../controllers/updateBook.js'; 
import { deleteBook } from '../controllers/deleteBook.js';
import { returnBook } from '../controllers/returnBook.js';

const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Books data file path
const booksDataPath = path.join(__dirname, '../data/booksData.json');


// Add a new book (only accessible by admin)
router.post('/add', isAdmin, addBook); 

// Lend a book
router.post('/lend', authenticateUser, lendBook);

// Return a lent book
router.post('/return', authenticateUser, returnBook);

// Update a book (only accessible by admin)
router.put('/:id', isAdmin, updateBook);

// Delete a book (only accessible by admin)
router.delete('/:id', isAdmin, deleteBook);

// Get all books
router.get('/', async (req, res) => {
  try {
    const { title, category, author } = req.query;

    // Read user data from bookData.json
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    let allBooks = JSON.parse(booksData);

    if (title) {
      allBooks = allBooks.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (category) {
      allBooks = allBooks.filter((book) =>
        book.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (author) {
      allBooks = allBooks.filter((book) =>
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    res.json({
      message: 'All books retrieved successfully',
      books: allBooks,
    });
  } catch (err) {
    console.error('Error reading user data:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:category?', async (req, res) => {
  const categoryParam = req.params.category;

  try {
    // Read books data from booksData.json
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    let books = JSON.parse(booksData);

    // If a category is specified, filter books by that category
    if (categoryParam) {
      const categoryBooks = books.filter((book) => book.category === categoryParam);
      res.json({ message: `Books in the category ${categoryParam} retrieved successfully`, data: categoryBooks });
    } else {
      res.json({ message: 'All books retrieved successfully', data: books });
    }
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
  
export default router;