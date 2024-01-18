import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

export const LentBooks = sequelize.define(
  'LentBooks',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    initialCharge: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    returnedAt: {
      type: DataTypes.DATE, 
      allowNull: true,
    },
  },
  {
    timestamps: false, 
  }
);

