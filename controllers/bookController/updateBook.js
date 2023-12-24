import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const updateBook = async (req, res) => {
  try {
    const booksDataPath = path.join(__dirname, '../../data/booksData.json');
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    let books = JSON.parse(booksData);

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
        category
      };

      // Write the updated book data back to booksData.json
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

      res.json({ message: 'Book updated successfully', data: books[bookIndex] });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Internal Server Error');
  }
};
