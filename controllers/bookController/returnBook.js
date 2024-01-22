import { User, Book, LentBooks } from '../../models/index.js';

export const returnBook = async (req, res) => {
  try {
    // Check the role of the user making the request
    const { role } = req.login;

    // If the user is an admin, disallow returning books
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to lend or return books.' });
    }

    let bookId;

    if (req.params.id) {
      bookId = req.params.id;
    } else if (req.body.bookId) {
      bookId = req.body.bookId;
    } else {
      return res.status(400).json({ error: 'Book ID not provided in URL or request body' });
    }

    // Fetch user and book details using Sequelize models
    const user = await User.findByPk(req.login.id, {
      include: [{
        model: Book,
        as: 'lentBooks',
        through: {
          model: LentBooks,
          where: { bookId },
        },
      }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the book is in the user's lent books
    if (!user.lentBooks || user.lentBooks.length === 0) {
      return res.status(404).json({ message: 'Book not found in the user\'s lent books' });
    }

    // Retrieve the lent book details
    const lentBook = user.lentBooks[0]; // Assuming only one lent book per user per book

    // Find the book by ID
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate charges until the return date
    const lendingPrice = book.lendingPrice;
    const days = calculateDaysDifference(lentBook.LentBooks.timestamp, new Date().toISOString());
    const initialCharge = lendingPrice;
    const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Remove the lent book association
    await user.removeLentBook(book);

    // Increase the book quantity
    await book.increment('quantity');

    res.json({
      message: 'Book returned successfully',
      data: {
        bookId,
        initialCharge,
        additionalCharge,
        totalCharge,
        days,
      },
    });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Function to calculate the difference in days between two dates
function calculateDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.abs(end - start);
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}
