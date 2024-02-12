import { Book } from '../../models/index.js';
import { Op } from 'sequelize';

const sortBooks = (books, sortField, sortOrder) => {
  if (sortField && sortOrder) {
    books.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }
  return books;
};

export const getBooks = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 12, sortField, sortOrder } = req.query;
    const isAdmin = req.login && req.login.role === 'admin';
    
    if (page <= 0) {
      return res.status(400).json({ message: 'Please enter a valid page number greater than 0.' });
    }

    // Build the where condition for search
    const whereCondition = search ? {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ],
    } : {};

    let allBooks = await Book.findAll({
      where: whereCondition,
      paranoid: !isAdmin, // Exclude soft-deleted records for regular users
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[sortField || 'id', sortOrder || 'asc']],
    });

    const totalBooks = await Book.count({
      where: whereCondition,
      paranoid: !isAdmin,
    });

    res.json({
      message: 'Books retrieved successfully',
      totalBooks,
      booksFetched: allBooks.length,
      data: allBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / pageSize),
    });
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).send('Internal Server Error');
  }
};

export const getBooksByCategory = async (req, res) => {
  const categoryParam = req.params.category;
  try {
    const { page = 1, pageSize = 12, sortField, sortOrder } = req.query;
    
    if (page <= 0) {
      return res.status(400).json({ message: 'Please enter a valid page number greater than 0.' });
    }

    let categoryBooks = await Book.findAll({
      where: {
        category: categoryParam,
        ...(req.login && req.login.role !== 'admin' ? { deletedAt: null } : {}),
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[sortField || 'id', sortOrder || 'asc']],
    });

    const totalBooks = await Book.count({ where: { category: categoryParam } });

    if (categoryBooks.length > 0) {
      res.json({
        message: `Books in the category ${categoryParam} retrieved successfully`,
        totalBooks,
        booksFetched: categoryBooks.length,
        books: categoryBooks,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / pageSize),
      });
    } else {
      res.status(404).json({
        message: `No books found for the category ${categoryParam}. Please enter a correct category name.`,
      });
    }
  } catch (err) {
    console.error('Error reading books data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBookById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findByPk(bookId, { paranoid: !req.login || req.login.role !== 'admin' });

    if (!book || (req.login && req.login.role !== 'admin')) {
      // For regular users, do not show soft-deleted books
      return res.status(404).send('Book not found');
    }

    res.json(book);
  } catch (err) {
    console.error('Error reading book data:', err);
    res.status(500).send('Internal Server Error');
  }
};

