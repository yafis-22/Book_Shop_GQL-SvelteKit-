import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const lendBook = async (req, res) => {
    
  try {
    const { bookId, days } = req.body;

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

    // Read books data from booksData.json
    const booksDataPath = path.join(__dirname, '../data/booksData.json');
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const books = JSON.parse(booksData);

    // Find the book by ID
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is available
    if (book.quantity <= 0) {
      return res.status(400).json({ message: 'Book not available for lending' });
    }

    // Calculate charges
    const lendingPrice = book.lendingPrice;
    const initialCharge = lendingPrice;
    const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Update user data
    user.lentBooks.push({
      bookId,
      days,
      totalCharge,
      timestamp: new Date().toISOString(),
    });

    // Update book data
    book.quantity--;

    // Write the updated data back to userData.json and booksData.json
    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
    await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

    res.json({
      message: 'Book lent successfully',
      chargeDetails: {
        initialCharge,
        additionalCharge,
        totalCharge,
      },
    });
  } catch (err) {
    console.error('Error lending book:', err);
    res.status(500).send('Internal Server Error');
  }
};
