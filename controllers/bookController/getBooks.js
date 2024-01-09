import * as bookModel from '../../models/bookModal.js';

export const getBooks = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10, sort } = req.query;
    const isAdmin = req.login && req.login.role === 'admin';
    
    if (page <= 0) {
      return res.status(400).json({ message: 'Please enter a valid page number greater than 0.' });
    }
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
    // Sorting logic
    if (sort === 'title-asc') {
      allBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'title-desc') {
      allBooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === 'price-asc') {
      allBooks.sort((a, b) => a.lendingPrice - b.lendingPrice);
    } else if (sort === 'price-desc') {
      allBooks.sort((a, b) => b.lendingPrice - a.lendingPrice);
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
      data: paginatedBooks,
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
      const { page = 1, pageSize = 10, sort } = req.query;
      
      if (page <= 0) {
        return res.status(400).json({ message: 'Please enter a valid page number greater than 0.' });
      }
      let categoryBooks = await bookModel.getBooksByCategory(categoryParam);

      const isAdmin = req.login && req.login.role === 'admin';

      if (!isAdmin) {
        // Filter books for regular users to show only non-deleted books
        categoryBooks = categoryBooks.filter((book) => !book.deleted);
      }
       // Sorting logic
      if (sort === 'title-asc') {
        allBooks.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === 'title-desc') {
        allBooks.sort((a, b) => b.title.localeCompare(a.title));
      } else if (sort === 'price-asc') {
        allBooks.sort((a, b) => a.lendingPrice - b.lendingPrice);
      } else if (sort === 'price-desc') {
        allBooks.sort((a, b) => b.lendingPrice - a.lendingPrice);
      }
      // Calculate start and end index for pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      // Get the books for the current page
      const paginatedBooks = categoryBooks.slice(startIndex, endIndex);
      if (paginatedBooks.length > 0) {
        res.json({
          message: `Books in the category ${categoryParam} retrieved successfully`,
          totalBooks: categoryBooks.length,
          booksFetched: paginatedBooks.length,
          books: paginatedBooks,
          currentPage: page,
          totalPages: Math.ceil(categoryBooks.length / pageSize),
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
  
      const isAdmin = req.login && req.login.role === 'admin';

      if (!isAdmin && book.deleted) {
        // For regular users, do not show deleted books
        res.status(404).send('Book not found');
      } else {
        res.json(book);
      }
    } catch (err) {
      console.error('Error reading book data:', err);
      res.status(500).send('Internal Server Error');
    }
  };