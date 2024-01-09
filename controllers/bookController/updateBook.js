import * as bookModel from '../../models/bookModal.js';

export const updateBook = async (req, res) => {
  try {
    let books = await bookModel.getBooks();

    const bookId = parseInt(req.params.id);

    // Find the index of the book by ID
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      // Update the book details from the request body
      const { title, description, lendingPrice, quantity, author, category } = req.body;

      // Update the book object
      books[bookIndex] = {
        ...books[bookIndex],
        title,
        description,
        lendingPrice,
        quantity,
        author,
        category,
        timestamp: new Date().toISOString(),
      };

      // Write the updated book data back to booksData.json using the model
      await bookModel.saveBooks(books);

      res.json({ message: 'Book updated successfully', data: books[bookIndex] });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Internal Server Error');
  }
};
