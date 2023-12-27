import * as userModel from '../../models/userModal.js';

export const activateUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const users = await userModel.getUsers();
  
      const userIndex = users.findIndex(user => user.id === userId);
  
      if (userIndex !== -1) {
        users[userIndex].deleted = false; // Activate the user
        await userModel.saveUsers(users);
        res.json({ message: 'User activated successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
    }catch (err) {
        console.error('Error activating user', err);
        res.status(500).send('Internal Server Error');
      }
    
  };