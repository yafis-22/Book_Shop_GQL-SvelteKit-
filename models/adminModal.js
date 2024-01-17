import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

export const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'Invalid username. It should be alphanumeric.',
          },
          len: {
            args: [3],
            msg: 'Username should be at least 3 characters long.',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isStrongPassword: {
            args: true,
            msg: 'Invalid password. Password must be at least 6 characters long and contain at least 1 number and 1 special character.',
          },
          len: {
            args: [6],
            msg: 'Password should be at least 6 characters long.',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid email address.',
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isMobilePhone: {
            args: true,
            msg: 'Invalid phone number. Please enter a 10-digit phone number.',
          },
        },
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
