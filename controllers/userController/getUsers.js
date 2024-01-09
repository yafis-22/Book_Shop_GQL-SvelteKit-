import * as userModel from '../../models/userModal.js';

const sortUsers = (users, sortField, sortOrder) => {
  if (sortField && sortOrder) {
    users.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }
  return users;
};

export const getAllUsers = async (req, res) => {
    try {
      const { search, page = 1, pageSize = 10, sortField, sortOrder } = req.query;
      
      if (page <= 0) {
        return res.status(400).json({ message: 'Please enter a valid page number greater than 0.' });
      }
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
      sortUsers(allUsers, sortField, sortOrder);

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