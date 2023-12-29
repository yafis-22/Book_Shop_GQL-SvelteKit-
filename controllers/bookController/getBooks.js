import * as bookModel from '../../models/bookModal.js';

export const getBooks = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const isAdmin = req.login && req.login.role === 'admin';

    let allBooks = await bookModel.getBooks();
    
    if (!isAdmin) {
      allBooks = allBooks.filter((book) => !book.deleted);
    }
    if (search) {
      // Case-insensitive search across various fields
      allBooks = allBooks.filter((book) =>
        Object.values(book).some((field) =>
          field.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Calculate start and end index for pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Get the books for the current page
    const paginatedBooks = allBooks.slice(startIndex, endIndex);

    res.json({
      message: 'Books retrieved successfully',
      totalBooks: allBooks.length,
      booksFetched: paginatedBooks.length,
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