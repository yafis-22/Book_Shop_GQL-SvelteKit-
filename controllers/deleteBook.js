import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteBook = async (req, res) => {
  try {
    const booksDataPath = path.join(__dirname, '../data/booksData.json');
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    let books = JSON.parse(booksData);

    const bookId = parseInt(req.params.id);

    // Find the index of the book by ID
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      // Remove the book from the array
      const deletedBook = books.splice(bookIndex, 1)[0];

      // Write the updated book data back to booksData.json
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

      res.json({ message: 'Book deleted successfully', data: deletedBook });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Internal Server Error');
  }
};
