import * as bookModel from '../../models/bookModal.js';

export const bookAvailable = async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const books = await bookModel.getBooks();

        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            if (!books[bookIndex].deleted) {
                // Check if req.body is empty
                if (Object.keys(req.body).length === 0) {
                    return res.status(400).json({ message: 'Request body is empty.' });
                }

                // Update other details if provided in the request body
                const { title, description, lendingPrice, quantity, author, category } = req.body;
                if (title) books[bookIndex].title = title;
                if (description) books[bookIndex].description = description;
                if (lendingPrice) books[bookIndex].lendingPrice = lendingPrice;
                if (quantity) books[bookIndex].quantity = quantity;
                if (author) books[bookIndex].author = author;
                if (category) books[bookIndex].category = category;

                // Book is already available, update and show updated message
                await bookModel.saveBooks(books);
                return res.json({ message: 'Book details updated.', data: books[bookIndex] });
            }

            // Book is not available, make it available
            books[bookIndex].deleted = false;
            await bookModel.saveBooks(books);
            res.json({ message: 'Book is now available.', data: books[bookIndex] });
        } else {
            res.status(404).json({ message: 'Book not found.' });
        }
    } catch (err) {
        console.error('Error making book available', err);
        res.status(500).send('Internal Server Error');
    }
};
