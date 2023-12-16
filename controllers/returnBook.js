import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';
import { lendBook } from './lendBook.js';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

    // Read user data from userData.json
    const userDataPath = path.join(__dirname, '../data/userData.json');
    const userData = await fs.readFile(userDataPath, 'utf8');
    const users = JSON.parse(userData);

    // Find the user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book in the user's lent books
    const lentBookIndex = user.lentBooks.findIndex((lentBook) => lentBook.bookId === bookId);

    if (lentBookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in the user\'s lent books' });
    }

    // Retrieve the lent book details
    const lentBook = user.lentBooks[lentBookIndex];

    // Read books data from booksData.json
    const booksDataPath = path.join(__dirname, '../data/booksData.json');
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const books = JSON.parse(booksData);

    // Find the book by ID
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate charges until the return date
    const lendingPrice = book.lendingPrice;
    const days = calculateDaysDifference(lentBook.timestamp, new Date().toISOString());
    const initialCharge = lendingPrice;
    const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Clear the lent book from the user's lentBooks array
    user.lentBooks.splice(lentBookIndex, 1);

    // Increase the book quantity
    book.quantity++;

    // Write the updated data back to userData.json and booksData.json
    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
    await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

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
