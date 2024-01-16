import { Book } from '../../models/bookModal.js';

export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find the book by ID
    const existingBook = await Book.findByPk(bookId);

    if (existingBook) {
      // Update the book details from the request body
      const { title, description, lendingPrice, quantity, author, category } = req.body;

      // Update the book object
      await existingBook.update({
        title,
        description,
        lendingPrice,
        quantity,
        author,
        category,
      });

      res.json({ message: 'Book updated successfully', data: existingBook });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Internal Server Error');
  }
};
