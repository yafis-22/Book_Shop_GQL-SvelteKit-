import { User } from '../../models/index.js';
import { Book } from '../../models/index.js';

export const userDetails = async (req, res) => {
  try {
    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

    // If the user is an admin, disallow
    if (req.login.role === 'admin') {
      return res.status(403).json({ message: 'Invalid User Token.' });
    }

    // Get user details using Sequelize's findByPk method
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Book,
          as: 'lentBooks',
          attributes: ['id', 'title', 'author', 'category'],
          through: {
            attributes: ['initialCharge', 'timestamp'],
            as: 'chargedDetails'
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send only the user's details
    res.json({ message: 'User details', data: user });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).send('Internal Server Error');
  }
};

