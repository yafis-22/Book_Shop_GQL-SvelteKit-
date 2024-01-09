import * as bookModel from '../../models/bookModal.js';

export const addBook = async (req, res) => {
  try {
    const books = await bookModel.getBooks();

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
      category,
      deleted: false,
      timestamp: new Date().toISOString(),
    };

    books.push(newBook);

     // Write the updated book data back to booksData.json using the model
     await bookModel.saveBooks(books);

    res.json({ message: 'Book added successfully', data: newBook });
  } catch (err) {
    console.error('Error adding new book:', err);
    res.status(500).send('Internal Server Error');
  }
};
