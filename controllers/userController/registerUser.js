import bcrypt from 'bcrypt';
import * as userModel from '../../models/userModal.js';

const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isMobilePhone = (str) => /^[0-9]{10}$/.test(str);
const isStrongPassword = (str) => /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(str);

export const registerUser = async (req, res) => {
  try {
    const users = await userModel.getUsers();

    const { username, password, email, phoneNumber, address } = req.body;

    if (!username || !password || !email || !phoneNumber || !address) {
      return res.status(400).json({ message: 'Please enter all fields i.e username, password, email, phoneNumber, address.' });
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

    // Check if the username or email is already taken
    const isUsernameTaken = users.some((user) => user.username === username);
    const isEmailTaken = users.some((user) => user.email === email);
    if (isUsernameTaken || isEmailTaken) {
      return res.status(400).json({ message: 'Username or email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
      lentBooks: [],
      deleted: false
    };

    users.push(newUser);

    // Write the updated user data back to userData.json using the model
    await userModel.saveUsers(users);
    res.json({ message: 'New user is registered', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Internal Server Error');
  }
};
