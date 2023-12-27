import * as bookModel from '../../models/bookModal.js';

export const getBooks = async (req, res) => {
  try {
      const { title, category, author, page = 1, pageSize = 10 } = req.query;

      let allBooks = await bookModel.getBooks();

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

      // Calculate start and end index for pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      // Get the books for the current page
      const paginatedBooks = allBooks.slice(startIndex, endIndex);

      res.json({
          message: 'Books retrieved successfully',
          books: paginatedBooks,
          currentPage: page,
          totalPages: Math.ceil(allBooks.length / pageSize),
      });
  } catch (err) {
      console.error('Error reading books data:', err);
      res.status(500).send('Internal Server Error');
  }
};


export const getBooksByCategory = async (req, res) => {
    const categoryParam = req.params.category;
  
    try {
      const categoryBooks = await bookModel.getBooksByCategory(categoryParam);
  
      if (categoryBooks.length > 0) {
        res.json({
          message: `Books in the category ${categoryParam} retrieved successfully`,
          data: categoryBooks,
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
    const bookId = parseInt(req.params.id);
  
    try {
      const book = await bookModel.getBookById(bookId);
  
      if (book) {
        res.json(book);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (err) {
      console.error('Error reading book data:', err);
      res.status(500).send('Internal Server Error');
    }
  };