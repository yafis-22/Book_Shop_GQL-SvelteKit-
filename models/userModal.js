import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userDataPath = path.join(__dirname, '../data/userData.json');
const adminDataPath = path.join(__dirname, '../data/adminData.json');

// user modal
import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import { Book } from './bookModal.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
paranoid: true, // Enable soft deletion
});

// Define association with Book model
User.hasMany(Book, { as: 'lentBooks', foreignKey: 'userId' });
Book.belongsTo(User, { as: 'user', foreignKey: 'userId' });


export const getUsers = async () => {
  try {
    const userData = await fs.readFile(userDataPath, 'utf8');
    return JSON.parse(userData);
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId) => {
    try {
      const users = await getUsers();
      return users.find((user) => user.id === userId);
    } catch (error) {
      throw error;
    }
  };

export const saveUsers = async (users) => {
  try {
    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
  } catch (error) {
    throw error;
  }
};

export const softDeleteUser = async (userId) => {
    try {
      let users = await getUsers();
    
      // Find the user by ID
      const userIndex = users.findIndex((user) => user.id === userId);
  
      if (userIndex === -1 || users[userIndex].deleted) {
        return null; 
      }
  
      // Mark the user as deleted
    users[userIndex].deleted = true;

    // Write the updated user data back to userData.json
    await saveUsers(users);

    return users[userIndex];
    } catch (error) {
      throw error;
    }
  };

export const getAdmins = async () => {
  try {
    const adminData = await fs.readFile(adminDataPath, 'utf8');
    return JSON.parse(adminData);
  } catch (error) {
    throw error;
  }
};

export const saveAdmins = async (adminUsers) => {
  try {
    await fs.writeFile(adminDataPath, JSON.stringify(adminUsers, null, 2));
  } catch (error) {
    throw error;
  }
};