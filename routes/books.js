import express from 'express';
import { isAdmin, authenticateUser } from '../middlewares/authMiddleware.js';
import { lendBook } from '../controllers/bookController/lendBook.js';
import { addBook } from '../controllers/bookController/addBooks.js';
import { updateBook } from '../controllers/bookController/updateBook.js'; 
import { deleteBook } from '../controllers/bookController/deleteBook.js';
import { returnBook } from '../controllers/bookController/returnBook.js';
import { getBooks, getBooksByCategory, getBookById } from '../controllers/bookController/getBooks.js';
import { bookAvailable } from '../controllers/bookController/bookAvailable.js';

const router = express.Router();

// Add a new book (only accessible by admin)
router.post('/', isAdmin, addBook); 

// Lend a book
router.post('/lend/:id?', authenticateUser, lendBook);

// Return a lent book
router.post('/return/:id?', authenticateUser, returnBook);

// Update a book (only accessible by admin)
router.put('/:id', isAdmin, updateBook);

// Delete a book (only accessible by admin)
router.delete('/:id?', isAdmin, deleteBook);

// Get all books with optional authentication
router.get('/', (req, res, next) => {
    if (req.headers.authorization) {
      // If authentication token is present, apply the authenticateUser middleware
      authenticateUser(req, res, next);
    } else {
      // If no authentication token is present, skip the authenticateUser middleware
      next();
    }
  }, getBooks);

// Get all books by id
router.get('/:id', (req, res, next) => {
    if (req.headers.authorization) {
      // If authentication token is present, apply the authenticateUser middleware
      authenticateUser(req, res, next);
    } else {
      // If no authentication token is present, skip the authenticateUser middleware
      next();
    }
  }, getBookById);

// Get all books by category
router.get('/category/:category', (req, res, next) => {
  if (req.headers.authorization) {
    // If authentication token is present, apply the authenticateUser middleware
    authenticateUser(req, res, next);
  } else {
    // If no authentication token is present, skip the authenticateUser middleware
    next();
  }
}, getBooksByCategory);

// Make book available
router.patch('/:id', isAdmin, bookAvailable )
  
export default router;