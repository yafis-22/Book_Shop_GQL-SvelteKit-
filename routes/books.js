import express from 'express';
import { isAdmin, authenticateUser } from '../middlewares/authMiddleware.js';
import { lendBook } from '../controllers/bookController/lendBook.js';
import { addBook } from '../controllers/bookController/addBook.js';
import { updateBook } from '../controllers/bookController/updateBook.js'; 
import { deleteBook } from '../controllers/bookController/deleteBook.js';
import { returnBook } from '../controllers/bookController/returnBook.js';
import { getBooks, getBooksByCategory } from '../controllers/bookController/getBook.js';
import { bookAvailable } from '../controllers/bookController/bookAvailable.js';

const router = express.Router();

// Add a new book (only accessible by admin)
router.post('/', isAdmin, addBook); 

// Lend a book
router.post('/lend', authenticateUser, lendBook);

// Return a lent book
router.post('/return', authenticateUser, returnBook);

// Update a book (only accessible by admin)
router.put('/:id', isAdmin, updateBook);

// Delete a book (only accessible by admin)
router.delete('/', isAdmin, deleteBook);

// Delete a book by Id (only accessible by admin)
router.delete('/:id', isAdmin, deleteBook);

// Get all books
router.get('/', getBooks);

router.get('/:category', getBooksByCategory);

router.patch('/:id/add', isAdmin, bookAvailable )
  
export default router;