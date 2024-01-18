import { User } from '../../models/index.js';
import { Book } from '../../models/index.js';
import { LentBooks } from '../../models/lentBooksModal.js';

export const lendBook = async (req, res) => {
  try {
    // Check the role of the user making the request
    const { role } = req.login;

    // If the user is an admin, disallow lending books
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to lend books.' });
    }

    let bookId;

    if (req.params.id) {
      bookId = req.params.id;
    } else if (req.body.bookId) {
      bookId = req.body.bookId;
    } else {
      return res.status(400).json({ error: 'Book ID not provided in URL or request body' });
    }

    // Fetch user and book details using models
    const user = await User.findByPk(req.login.id);
    const book = await Book.findByPk(bookId);

    // Check if the user and book exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the user has already lent a book with the same ID
    const hasAlreadyLent = await user.hasLentBook(book);

    if (hasAlreadyLent) {
      return res.status(400).json({ message: 'User has already lent a book with the same ID' });
    }

    // Check if the book is available
    if (book.quantity <= 0 || book.deletedAt) {
      return res.status(400).json({ message: 'Book not available for lending' });
    }

    // Calculate charges
    const lendingPrice = book.lendingPrice;
    const initialCharge = lendingPrice;

    // Use Sequelize's association to add the lent book to the user
    await LentBooks.create({
      userId: user.id,
      bookId: book.id,
      initialCharge,
      timestamp: new Date(),
    });

    // Update book data
    await book.decrement('quantity');

    res.json({
      message: 'Book lent successfully',
      chargeDetails: {
        data: book,
        initialCharge,
      },
    });
  } catch (err) {
    console.error('Error lending book:', err);
    res.status(500).send('Internal Server Error');
  }
};
