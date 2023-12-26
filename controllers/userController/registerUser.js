import bcrypt from 'bcrypt';
import validator from 'validator';
import * as userModel from '../../models/userModal.js';

export const registerUser = async (req, res) => {
  try {
    const users = await userModel.getUsers();

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Please enter your username, password, and email' });
    }

    // Validate username
    if (!validator.isAlphanumeric(username) || validator.isEmpty(username) || !validator.isLength(username, { min: 3 })) {
      return res.status(400).json({ message: 'Invalid username. It should be alphanumeric and at least 3 characters long' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Validate password
    if (!validator.isLength(password, { min: 6 }) || !validator.matches(password, /(?=.*[0-9])(?=.*[!@#$%^&*])/)) {
      return res.status(400).json({
        message: 'Invalid password. Password must be at least 6 characters long and contain at least 1 number and 1 special character',
      });
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
      lentBooks: []
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
