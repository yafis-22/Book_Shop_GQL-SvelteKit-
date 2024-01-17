import jwt from 'jsonwebtoken';
import fs from 'fs';
import { User } from '../models/userModal.js';

// Read the configuration from JSON file
const configFile = 'config.json';
const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

const secretKey = config.JWT_SECRET_KEY;

export const isAdmin = async (req, res, next) => {
  try {
    let adminToken = req.headers.authorization;

    if (!adminToken) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    adminToken = adminToken.split(" ")[1]
    
    jwt.verify(adminToken, secretKey, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid token or token expired. Please login again. Or you may not be admin' });
      }

      if (decodedToken.role === 'admin') {
        // If the role is admin, proceed to the next middleware or route
        next();
      } else {
        res.status(403).send('Unauthorized. Only admin can perform this action.');
      }
    });
  } catch (err) {
    console.error('Error checking admin status:', err);
    res.status(500).send('Internal Server Error');
  }
};

export const authenticateUser = async (req, res, next) => {
  let userToken = req.headers.authorization;

  if (!userToken) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  userToken = userToken.split(" ")[1]
  
    jwt.verify(userToken, secretKey, async (err, login) => {
      if (err) {
        console.log(err)
        return res.status(403).json({ message: 'Invalid token or token expired. Please login again' });
      } else {
        // Check if the user is soft-deleted
        const user = await User.findOne({
          where: { id: login.id },
          paranoid: false, // Include soft-deleted records
        });
  
        if (!user || user.deletedAt) {
          return res.status(401).json({ message: 'User is deleted or does not exist' });
        }
        req.login = login;
        next();
      }
    });
};

