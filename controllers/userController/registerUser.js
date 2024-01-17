import bcrypt from 'bcrypt';
import { User } from '../../models/userModal.js';
import { Admin } from '../../models/adminModal.js';

export const registerUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address, role } = req.body;

    if (!username || !password || !email || !phoneNumber || !address || !role) {
      return res.status(400).json({ message: 'Please enter all fields i.e username, password, email, phoneNumber, address, role.' });
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