import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

export const LentBooks = sequelize.define(
  'LentBooks',
  {
    initialCharge: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, 
  }
);
