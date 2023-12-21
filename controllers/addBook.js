import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addBook = async (req, res) => {
  try {
    const booksDataPath = path.join(__dirname, '../data/booksData.json');
    const booksData = await fs.readFile(booksDataPath, 'utf8');
    const books = JSON.parse(booksData);

    // Get book details from the request body
    const { title, description, lendingPrice, quantity, author, category } = req.body;

    // Check if a book with the same title already exists
    const existingBook = books.find(book => book.title === title);

    if (existingBook) {
      return res.status(400).json({ message: 'Book with the same title already exists'});
    }

    // Create a new book object
    const newBook = {
      id: books.length + 1,
      title,
      description,
      lendingPrice,
      quantity,
      author,
      category
    };

    books.push(newBook);

    // Write the updated book data back to booksData.json
    await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

    res.json({ message: 'Book added successfully', data: newBook });
  } catch (err) {
    console.error('Error adding new book:', err);
    res.status(500).send('Internal Server Error');
  }
};
