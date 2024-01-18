import bcrypt from 'bcrypt';
import { User } from '../../models/index.js';
import { Admin } from '../../models/adminModal.js';

const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isMobilePhone = (str) => /^[0-9]{10}$/.test(str);
const isStrongPassword = (str) => /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(str);

export const registerUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address, role } = req.body;

    if (!username || !password || !email || !phoneNumber || !address || !role) {
      return res.status(400).json({ message: 'Please enter all fields i.e username, password, email, phoneNumber, address, role.' });
    }

    // Validate username
    if (!isAlphanumeric(username) || username.length < 3) {
      return res.status(400).json({ message: 'Invalid username. It should be alphanumeric and at least 3 characters long' });
    }

    // Validate email
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Validate password
    if (!isStrongPassword(password) || password.length < 6) {
      return res.status(400).json({
        message: 'Invalid password. Password must be at least 6 characters long and contain at least 1 number and 1 special character',
      });
    }

    // Validate phone number
    if (!isMobilePhone(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number. Please enter 10 digit phone number.' });
    }

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. It should be either "user" or "admin"' });
    }

    // Check if the username or email is already taken
    const isUsernameTaken = await (role === 'admin' ? Admin.findOne({ where: { username } }) : User.findOne({ where: { username } }));
    const isEmailTaken = await (role === 'admin' ? Admin.findOne({ where: { email } }) : User.findOne({ where: { email } }));

    if (isUsernameTaken || isEmailTaken) {
      return res.status(400).json({ message: 'Username or email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user or admin object based on the role
    const newUser = await (role === 'admin' ? Admin.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
      role,
    }) : User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
      role,
    }));

    res.json({ message: 'New user is registered', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Internal Server Error');
  }
};