import { Book } from '../../models/bookModal.js';

export const bookAvailable = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);

    // Find the soft-deleted book by ID
    const deletedBook = await Book.findOne({
      where: { id: bookId },
      paranoid: false, // Include soft-deleted records
    });

    if (deletedBook) {
      if (!deletedBook.deletedAt) {
        return res.json({ message: 'Book is already activated', data: deletedBook });
    }
      // Restore the soft-deleted book
      await deletedBook.restore();

      res.json({ message: 'Book restored successfully', data: deletedBook });
    } else {
      res.status(404).json({ message: 'Book not found or permanently deleted.' });
    }
  } catch (err) {
    console.error('Error restoring book:', err);
    res.status(500).send('Internal Server Error');
  }
};
