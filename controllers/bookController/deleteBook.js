import { Book } from '../../models/bookModal.js';

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

    // Sequelize's destroy method for soft deletion
    const deletedBook = await Book.destroy({
      where: { id: bookId },
      returning: true, // Ensure the deleted record is returned
      paranoid: false, // Override 
    });

    if (deletedBook > 0) {
      res.json({ message: 'Book deleted successfully', data: deletedBook });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Internal Server Error');
  }
};
