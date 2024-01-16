import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const booksDataPath = path.join(__dirname, '../data/booksData.json');

export const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lendingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

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
        const lowercaseCategoryParam = categoryParam.toLowerCase();
        return books.filter((book) => book.category.toLowerCase() === lowercaseCategoryParam);
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

export const getBookById = async (bookId) => {
    try {
      const books = await getBooks();
      return books.find((book) => book.id === bookId);
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

export const softDeleteBook = async (bookId) => {
    try {
      let books = await getBooks();
  
      // Find the index of the book by ID
      const bookIndex = books.findIndex((book) => book.id === bookId);
  
      if (bookIndex === -1 || books[bookIndex].deleted) {
        return null; 
      }
  
      // Mark the book as deleted
      books[bookIndex].deleted = true;

        // Write the updated book data back to booksData.json
      await saveBooks(books);
  
      return books[bookIndex];
    } catch (error) {
      throw error;
    }
  };
  

  
