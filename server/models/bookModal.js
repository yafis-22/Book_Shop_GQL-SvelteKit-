import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

export const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lendingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Romance', 'Science', 'Adventure', 'Fantasy', 'Friction', 'History', 'Literature', 'Mystery']],
    },
  },
  imageSrc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  paranoid: true, // Enable soft deletion
});

