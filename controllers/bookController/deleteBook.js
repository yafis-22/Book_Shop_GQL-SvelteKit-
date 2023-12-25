import * as bookModel from '../../models/bookModal.js';

export const deleteBook = async (req, res) => {
  try {
    const { bookId }  = req.body;

    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID in the request body' });
    }
     // Delete the book by ID using the model
    const deletedBook = await bookModel.deleteBookById(bookId);

    if (deletedBook) {
      res.json({ message: 'Book deleted successfully', data: deletedBook });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Internal Server Error');
  }
};
