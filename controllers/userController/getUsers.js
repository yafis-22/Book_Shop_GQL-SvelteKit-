import * as userModel from '../../models/userModal.js';

export const getAllUsers = async (req, res) => {
    try {
      const { username, page = 1, pageSize = 10 } = req.query;
  
      let allUsers = await userModel.getUsers();
  
      if (username) {
        allUsers = allUsers.filter((user) =>
          user.username.toLowerCase().includes(username.toLowerCase())
        );
      }

      // Calculate start and end index for pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      // Get the books for the current page
      const paginatedUsers = allUsers.slice(startIndex, endIndex);
      res.json({
        message: 'Users retrieved successfully',
        users: paginatedUsers,
        currentPage: page,
        totalPages: Math.ceil(allUsers.length / pageSize),
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