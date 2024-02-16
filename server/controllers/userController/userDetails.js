// userDetails
import { User, Book, LentBooks } from '../../models/index.js';

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
            as: 'chargedDetails',
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Calculate additional charges, total charges, and days for each lent book
    const userDetails = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      lentBooks: user.lentBooks.map((lentBook) => {
        const days = calculateDaysDifference(lentBook.chargedDetails.timestamp, new Date().toISOString());
        const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
        const totalCharge = lentBook.chargedDetails.initialCharge + additionalCharge;

        return {
          id: lentBook.id,
          title: lentBook.title,
          author: lentBook.author,
          category: lentBook.category,
          initialCharge: lentBook.chargedDetails.initialCharge,
          additionalCharge,
          totalCharge,
          days,
        };
      }),
    };

    // Send the updated user details
    res.json({ message: 'User details', data: userDetails });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Function to calculate the difference in days between two dates
function calculateDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.abs(end - start);
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}
