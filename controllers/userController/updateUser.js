import validator from 'validator';
import * as userModel from '../../models/userModal.js';

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
      if (!validator.isAlphanumeric(username) || validator.isEmpty(username) || !validator.isLength(username, { min: 3 })) {
        return res.status(400).json({ message: 'Invalid username' });
      }
      userToUpdate.username = username;
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
      userToUpdate.email = email;
    }

    if (phoneNumber) {
      if (!validator.isMobilePhone(phoneNumber, 'any', { strictMode: false})) {
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
