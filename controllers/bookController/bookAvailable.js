import * as bookModel from '../../models/bookModal.js';

export const bookAvailable = async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      const books = await bookModel.getBooks();
  
      const bookIndex = books.findIndex(book => book.id === bookId);
  
      if (bookIndex !== -1) {
        if (!books[bookIndex].deleted) {
            return res.json({ message: 'Book is already available.' });
          }
          
        books[bookIndex].deleted = false; // Make the book available
        await bookModel.saveBooks(books);
        res.json({ message: 'Book is now available.', data:books[bookIndex] });
    } else {
      res.status(404).json({ message: 'Book not found.' });
    }
    }catch (err) {
        console.error('Error making book available', err);
        res.status(500).send('Internal Server Error');
      }
    
  };