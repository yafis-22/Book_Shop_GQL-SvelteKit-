import * as userModel from '../../models/userModal.js';
import * as bookModel from '../../models/bookModal.js';

export const lendBook = async (req, res) => {
    
  try {
    let bookId;

    if (req.params.id) {
      bookId = parseInt(req.params.id);    
  } else if (req.body.bookId) {
      bookId = req.body.bookId;
  } else {
      return res.status(400).json({ error: 'Book ID not provided in URL or request body' });
    }

    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

    // Get user and book details using models
    const users = await userModel.getUsers();
    const books = await bookModel.getBooks();

    // Find the user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book by ID
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is available
    if (book.quantity <= 0 || book.deleted) {
      return res.status(400).json({ message: 'Book not available for lending' });
    }

    // Calculate charges
    const lendingPrice = book.lendingPrice;
    const initialCharge = lendingPrice;

    // Update user data
    user.lentBooks.push({
      bookId,
      initialCharge,
      timestamp: new Date().toISOString(),
    });

    // Update book data
    book.quantity--;

    // Write the updated data back using models
    await userModel.saveUsers(users);
    await bookModel.saveBooks(books);

    res.json({
      message: 'Book lent successfully',
      chargeDetails: {
        initialCharge,
      },
    });
  } catch (err) {
    console.error('Error lending book:', err);
    res.status(500).send('Internal Server Error');
  }
};
