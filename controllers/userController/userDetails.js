import * as userModel from '../../models/userModal.js';

export const userDetails = async (req, res) => {
  try {
    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

    // Get user details using the model
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send only the user's details
    res.json({ message: 'User details', data:user });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).send('Internal Server Error');
  }
};
