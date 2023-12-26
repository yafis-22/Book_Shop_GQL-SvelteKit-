import * as userModel from '../../models/userModal.js';

const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isMobilePhone = (str) => /^[0-9]{10}$/.test(str);

export const updateUser = async (req, res) => {
  try {
    const userId  = req.login.id
    const { username, email, phoneNumber, address } = req.body;

    const users = await userModel.getUsers();

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      const userToUpdate = { ...users[userIndex] };

    // Validate input data
    if (username) {
      if (!isAlphanumeric(username) || username.length < 3) {
        return res.status(400).json({ message: 'Invalid username' });
      }
      userToUpdate.username = username;
    }

    if (email) {
      if (!isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
      userToUpdate.email = email;
    }

    if (phoneNumber) {
      if (!isMobilePhone(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number' });
      }
      userToUpdate.phoneNumber = phoneNumber;
    }

    if (address) {
      userToUpdate.address = address;
    }

    // Update the user data
    users[userIndex] = { ...userToUpdate };
    await userModel.saveUsers(users);

    res.json({ message: 'User details updated successfully', user: users[userIndex] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(500).send('Internal Server Error');
  }
};