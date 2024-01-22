import { User } from '../../models/index.js';
import { Book } from '../../models/index.js';

export const deleteUser = async (req, res) => {
  try {
    // Fetch user ID from the authenticated user's token
    const requestingUserId = req.login.id;

    // If the user is an admin, disallow
    if (req.login.role === 'admin') {
      return res.status(403).json({ message: 'Invalid User Token.' });
    }

    // Fetch the user data
    const user = await User.findByPk(requestingUserId, {
      include: [
        {
          model: Book,
          as: 'lentBooks',
          attributes: ['id', 'title', 'author', 'category'],
          through: {
            attributes: ['initialCharge', 'timestamp'],
          },
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has any lent books
    if (user.lentBooks.length > 0) {
      return res.status(400).json({ message: 'You need to return all books before deleting your account', data: user.lentBooks });
    }

    // Soft delete the user
    const deletedUser = await User.destroy({
      where: { id: requestingUserId }
    });

    if (deletedUser > 0) {
      res.json({ message: 'User deleted successfully', data: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting User:', err);
    res.status(500).send('Internal Server Error');
  }
};
