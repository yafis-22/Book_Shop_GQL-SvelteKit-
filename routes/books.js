import express from 'express';
import { isAdmin, authenticateUser } from '../middlewares/authMiddleware.js';
import { lendBook } from '../controllers/lendBook.js';
import { addBook } from '../controllers/addBook.js';
import { updateBook } from '../controllers/updateBook.js'; 
import { deleteBook } from '../controllers/deleteBook.js';
import { returnBook } from '../controllers/returnBook.js';
import { getBooks, getBooksByCategory } from '../controllers/getBook.js';

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
router.delete('/:id', isAdmin, deleteBook);

// Get all books
router.get('/', getBooks);

router.get('/:category?', getBooksByCategory);
  
export default router;