import { User } from '../../models/index.js';
import { Book } from '../../models/index.js';
import { LentBooks } from '../../models/index.js';

export const returnBook = async (req, res) => {
  try {
    // Check the role of the user making the request
    const { role, id } = req.login;

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

    // Fetch user from the database using Sequelize
    const user = await User.findByPk(id, {
      include: [{
        model: LentBooks,
        as: 'lentBooks', 
        where: {
          bookId,
          returnedAt: null,
        },
      }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book in the user's lent books
    const lentBook = user.lentBooks[0];

    if (!lentBook) {
      return res.status(404).json({ message: 'Book not found in the user\'s lent books' });
    }

    // Find the book by ID
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate charges until the return date
    const lendingPrice = book.lendingPrice;
    const days = calculateDaysDifference(lentBook.timestamp, new Date());
    const initialCharge = lendingPrice;
    const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Update the lent book with the return date
    await LentBooks.update({ returnedAt: new Date() }, { where: { id: lentBook.id } });

    // Increase the book quantity
    await Book.increment('quantity', { where: { id: bookId } });

    res.json({
      message: 'Book returned successfully',
      chargeDetails: {
        initialCharge,
        additionalCharge,
        totalCharge,
        days,
      },
    });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).send(err.message);
  }
};

// Function to calculate the difference in days between two dates
function calculateDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.abs(end - start);
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}
