import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const booksDataPath = path.join(__dirname, '../../data/booksData.json');
const booksData = await fs.readFile(booksDataPath, 'utf8');

export const getBooks = async (req, res) => {
    try {
      const { title, category, author } = req.query;
  
      let allBooks = JSON.parse(booksData);
  
      if (title) {
        allBooks = allBooks.filter((book) =>
          book.title.toLowerCase().includes(title.toLowerCase())
        );
      }
      if (category) {
        allBooks = allBooks.filter((book) =>
          book.category.toLowerCase() === category.toLowerCase()
        );
      }
  
      if (author) {
        allBooks = allBooks.filter((book) =>
          book.author.toLowerCase().includes(author.toLowerCase())
        );
      }
  
      res.json({
        message: 'All books retrieved successfully',
        books: allBooks,
      });
    } catch (err) {
      console.error('Error reading books data:', err);
      res.status(500).send('Internal Server Error');
    }
  };

  export const getBooksByCategory = async (req, res) => {
    const categoryParam = req.params.category;
  
    try {
      let books = JSON.parse(booksData);
  
      // If a category is specified, filter books by that category
      if (categoryParam) {
        const categoryBooks = books.filter(
          (book) => book.category === categoryParam
        );
        res.json({
          message: `Books in the category ${categoryParam} retrieved successfully`,
          data: categoryBooks,
        });
      } else {
        res.json({
          message: 'All books retrieved successfully',
          data: books,
        });
      }
    } catch (err) {
      console.error('Error reading books data:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };