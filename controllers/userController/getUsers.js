import * as userModel from '../../models/userModal.js';

export const getAllUsers = async (req, res) => {
    try {
      const { search, page = 1, pageSize = 10, sort } = req.query;
  
      let allUsers = await userModel.getUsers();
  
      if (search) {
        // Case-insensitive search across various fields
        allUsers = allUsers.filter((user) =>
          Object.values(user).some((field) =>
            field.toString().toLowerCase().includes(search.toLowerCase())
          )
        );
      }
      
      // Sorting logic
      if (sort === 'name-asc') {
        allUsers.sort((a, b) => a.username.localeCompare(b.username));
      } else if (sort === 'name-desc') {
        allUsers.sort((a, b) => b.username.localeCompare(a.username));
      }
      // Calculate start and end index for pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      // Get the books for the current page
      const paginatedUsers = allUsers.slice(startIndex, endIndex);
      res.json({
        message: 'Users retrieved successfully',
        totalUsers: allUsers.length,
        usersFetched: paginatedUsers.length,
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