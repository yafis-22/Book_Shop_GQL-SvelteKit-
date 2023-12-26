import * as userModel from '../../models/userModal.js';

const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isMobilePhone = (str) => /^[0-9]{10}$/.test(str);

export const updateUser = async (req, res) => {
  try {
    const  userId  = req.login.id
    const { username, email, phoneNumber, address } = req.body;

    const userToUpdate = await userModel.getUserById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

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
    await userModel.saveUsers(userToUpdate);

    res.json({ message: 'User details updated successfully', user: userToUpdate });
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(500).send('Internal Server Error');
  }
};
