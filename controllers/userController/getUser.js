import * as userModel from '../../models/userModal.js';

export const getAllUsers = async (req, res) => {
    try {
      const { username } = req.query;
  
      let allUsers = await userModel.getUsers();
  
      if (username) {
        allUsers = allUsers.filter((user) =>
          user.username.toLowerCase().includes(username.toLowerCase())
        );
      }
      res.json({
        message: 'All users retrieved successfully',
        users: allUsers,
      });
    } catch (err) {
      console.error('Error reading user data:', err);
      res.status(500).send('Internal Server Error');
    }
  };
  
export const getUserById = async (req, res) => {

    const userId = parseInt(req.params.id);
  
    try {
      const user = await userModel.getUserById(userId);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error('Error reading user data:', err);
      res.status(500).send('Internal Server Error');
    }
  };