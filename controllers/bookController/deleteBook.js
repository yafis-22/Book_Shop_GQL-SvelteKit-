import * as bookModel from '../../models/bookModal.js';

export const deleteBook = async (req, res) => {
  try {
    let bookId;

    if (req.params.id) {
      bookId = parseInt(req.params.id);    
  } else if (req.body.bookId) {
      bookId = req.body.bookId;
  } else {
      return res.status(400).json({ error: 'Book ID not provided in URL or request body' });
    }

    if (isNaN(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
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
