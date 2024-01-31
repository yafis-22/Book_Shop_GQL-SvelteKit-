import { User } from '../../models/index.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isMobilePhone = (str) => /^[0-9]{10}$/.test(str);
const isStrongPassword = (str) => /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(str);

export const updateUser = async (req, res) => {
  try {
    const userId = req.login.id;

    // If the user is an admin, disallow
    if (req.login.role === 'admin') {
      return res.status(403).json({ message: 'Invalid User Token.' });
    }

    const { username, email, phoneNumber, address, password } = req.body;

    // Fetch the user using Sequelize
    const userToUpdate = await User.findByPk(userId);

    if (userToUpdate) {
      // Check if the provided email or phoneNumber already exists
      if (email) {
        const duplicateEmail = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
        if (duplicateEmail) {
          return res.status(400).json({ message: 'Email already exists' });
        }
      }

      if (phoneNumber) {
        const duplicatePhoneNumber = await User.findOne({ where: { phoneNumber, id: { [Op.ne]: userId } } });
        if (duplicatePhoneNumber) {
          return res.status(400).json({ message: 'Phone number already exists' });
        }
      }

      // Validate input data
      if (username) {
        return res.status(400).json({ message: 'Username cannot be changed.' });
      }

      if (password) {
        if (!isStrongPassword(password) || password.length < 6) {
          return res.status(400).json({
            message: 'Invalid password. Password must be at least 6 characters long and contain at least 1 number and 1 special character',
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
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

      // Update the timestamp
      userToUpdate.timestamp = new Date().toISOString();

      // Save the updated user data
      await userToUpdate.save();

      res.json({ message: 'User details updated successfully', user: userToUpdate });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(500).send('Internal Server Error');
  }
};
