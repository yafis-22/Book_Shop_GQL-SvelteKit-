import * as bookModel from '../../models/bookModal.js';

export const bookAvailable = async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const books = await bookModel.getBooks();

        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            // Check if req.body is empty
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'Request body is empty.' });
            }

            // Update details if provided in the request body
            const { title, description, lendingPrice, quantity, author, category, deleted } = req.body;
            if (title) books[bookIndex].title = title;
            if (description) books[bookIndex].description = description;
            if (lendingPrice) books[bookIndex].lendingPrice = lendingPrice;
            if (quantity) books[bookIndex].quantity = quantity;
            if (author) books[bookIndex].author = author;
            if (category) books[bookIndex].category = category;

            // Check if "deleted" property is provided before updating
            if (deleted !== undefined) {
                if (typeof deleted !== 'boolean') {
                    return res.status(400).json({ message: 'Please provide the "deleted" property in the request body as a boolean.' });
                } else {
                    books[bookIndex].deleted = deleted;
                }
            }

            // Update the timestamp
            books[bookIndex].lastUpdated = new Date().toISOString();

            // Save the updated books array
            await bookModel.saveBooks(books);

            if (deleted === false) {
                // Book is now available
                return res.json({ message: 'Book is now available. Successfully updated', data: books[bookIndex] });
            } else if (deleted === true) {
                    // cannot delete
                    return res.json({ message: 'Book cannot be delete from update route.'});
            } else {
                // Book details updated
                return res.json({ message: 'Book details updated.', data: books[bookIndex] });
            }
        } else {
            res.status(404).json({ message: 'Book not found.' });
        }
    } catch (err) {
        console.error('Error making book available', err);
        res.status(500).send('Internal Server Error');
    }
};
