import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { isAdmin, authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Books data file path
const booksDataPath = path.join(__dirname, '../data/booksData.json');
// User data file path
const userDataPath = path.join(__dirname, '../data/userData.json');

// Get all books
router.get('/', async (req, res) => {
  try {
    // Read user data from bookData.json
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const allBooks = JSON.parse(booksData);

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
      const { title, description, lendingPrice, quantity, category } = req.body;
  
      // Create a new book object
      const newBook = {
        id: books.length + 1,
        title,
        description,
        lendingPrice,
        quantity,
        category
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
      const { title, description, lendingPrice, quantity, category } = req.body;

      // Update the book object
      books[bookIndex] = {
        ...books[bookIndex],
        title,
        description,
        lendingPrice,
        quantity,
        category
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

// Lend a book
router.post('/lend', authenticateUser, async (req, res) => {
  try {
    const { bookId, days } = req.body;

    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

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
    const initialCharge = lendingPrice;
    const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Update user data
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