import express from 'express';
import { isAdmin, authenticateUser } from '../middlewares/authMiddleware.js';
import { lendBook } from '../controllers/bookController/lendBook.js';
import { addBook } from '../controllers/bookController/addBook.js';
import { updateBook } from '../controllers/bookController/updateBook.js'; 
import { deleteBook } from '../controllers/bookController/deleteBook.js';
import { returnBook } from '../controllers/bookController/returnBook.js';
import { getBooks, getBooksByCategory } from '../controllers/bookController/getBook.js';

const router = express.Router();

// Add a new book (only accessible by admin)
router.post('/add', isAdmin, addBook); 

// Lend a book
router.post('/lend', authenticateUser, lendBook);

// Return a lent book
router.post('/return', authenticateUser, returnBook);

// Update a book (only accessible by admin)
router.put('/:id', isAdmin, updateBook);

// Delete a book (only accessible by admin)
router.delete('/', isAdmin, deleteBook);

// Get all books
router.get('/', getBooks);

router.get('/:category?', getBooksByCategory);
  
export default router;