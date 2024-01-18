import { Book } from '../../models/index.js';

export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find the book by ID
    const existingBook = await Book.findByPk(bookId);

    if (existingBook) {
      // Update the book details from the request body
      const { title, description, lendingPrice, quantity, author, category } = req.body;

    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is empty.' });
    }
      // Update the book object
      await existingBook.update({
        title,
        description,
        lendingPrice,
        quantity,
        author,
        category,
      });

      res.json({ message: 'Book updated successfully', data: existingBook });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Internal Server Error');
  }
};


// export const patchBook = async (req, res) => {
//   try {
//     const bookId = parseInt(req.params.id);

//     // Find the book in the database
//     const book = await Book.findByPk(bookId);

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found.' });
//     }

//     // Check if req.body is empty
//     if (Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: 'Request body is empty.' });
//     }

//     // Update details if provided in the request body
//     const { title, description, lendingPrice, quantity, author, category } = req.body;

//     // Use Sequelize update method to update the book
//     const updatedBook = await Book.update(
//       {
//         title: title || book.title,
//         description: description || book.description,
//         lendingPrice: lendingPrice || book.lendingPrice,
//         quantity: quantity || book.quantity,
//         author: author || book.author,
//         category: category || book.category,
//         lastUpdated: new Date().toISOString(),
//       },
//       {
//         where: { id: bookId },
//         returning: true, // Return the updated book
//         plain: true,
//       }
//     );

//     const updatedBookData = updatedBook[1];

//     res.json({
//       message: 'Book details updated.',
//       data: updatedBookData,
//     });
//   } catch (err) {
//     console.error('Error making book available:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };