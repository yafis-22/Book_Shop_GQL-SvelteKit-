import * as userModel from '../../models/userModal.js';

export const deleteUser = async (req, res) => {
    try {
      // Fetch user ID from the authenticated user's token
      const requestingUserId = req.login.id;
      
      // Fetch the user data
      const user = await userModel.getUserById(requestingUserId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user has any lent books
      if (user.lentBooks.length > 0) {
          return res.status(400).json({ message: 'You need to return all books before deleting your account', data:user.lentBooks });
      }

      // Remove the user from the array
      const deletedUser = await userModel.softDeleteUser(requestingUserId);
      
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully', data: deletedUser });
    } catch (err) {
      console.error('Error deleting User:', err);
      res.status(500).send('Internal Server Error');
    }
  };
  