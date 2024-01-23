import { Book } from '../../models/index.js';

export const addBook = async (req, res) => {
  try {
    const { title, description, lendingPrice, quantity, author, category } = req.body;

    if (!title || !description || !lendingPrice || !quantity || !author || !category) {
      return res.status(400).json({ message: 'Please enter all fields i.e title, description, lendingPrice, quantity, author, category.' });
    }

    const existingBook = await Book.findOne({ where: { title } });

    if (existingBook) {
      return res.status(400).json({ message: 'Book with the same title already exists' });
    }

    const newBook = await Book.create({
      title,
      description,
      lendingPrice,
      quantity,
      author,
      category,
    });

    res.json({ message: 'Book added successfully', data: newBook });
  } catch (err) {
    console.error('Error adding new book:', err);
    res.status(500).send('Internal Server Error');
  }
};
