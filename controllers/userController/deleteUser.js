import * as userModel from '../../models/userModal.js';

export const deleteUser = async (req, res) => {
    try {
      // Fetch user ID from the authenticated user's token
      const requestingUserId = req.login.id;
  
      // Remove the user from the array
      const deletedUser = await userModel.deleteUserById(requestingUserId);
      
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully', data: deletedUser });
    } catch (err) {
      console.error('Error deleting User:', err);
      res.status(500).send('Internal Server Error');
    }
  };
  