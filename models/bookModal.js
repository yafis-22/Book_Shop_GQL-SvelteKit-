import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const booksDataPath = path.join(__dirname, '../data/booksData.json');

export const getBooks = async () => {
    try {
      const booksData = await fs.readFile(booksDataPath, 'utf8');
      return JSON.parse(booksData);
    } catch (error) {
      throw error;
    }
  };

export const getBooksByCategory = async (categoryParam) => {
    try {
      const books = await getBooks();
  
      // If a category is specified, filter books by that category
      if (categoryParam) {
        return books.filter((book) => book.category === categoryParam);
      } else {
        return books;
      }
    } catch (error) {
      throw error;
    }
  };

export const saveBooks = async (books) => {
    try {
      await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));
    } catch (error) {
      throw error;
    }
  };

export const deleteBookById = async (bookId) => {
    try {
      let books = await getBooks();
  
      // Find the index of the book by ID
      const bookIndex = books.findIndex((book) => book.id === bookId);
  
      if (bookIndex !== -1) {
        // Remove the book from the array
        const deletedBook = books.splice(bookIndex, 1)[0];
  
        // Write the updated book data back to booksData.json
        await saveBooks(books);
  
        return deletedBook;
      } else {
        return null; 
      }
    } catch (error) {
      throw error;
    }
  };
  

  
