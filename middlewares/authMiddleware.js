import jwt from 'jsonwebtoken';
import "dotenv/config"
import * as userModel from '../models/userModal.js';

export const isAdmin = async (req, res, next) => {
  try {
    let adminToken = req.headers.authorization;

    if (!adminToken) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    adminToken = adminToken.split(" ")[1]
    
    jwt.verify(adminToken, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
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
  
    jwt.verify(userToken, process.env.JWT_SECRET_KEY, async (err, login) => {
      if (err) {
        console.log(err)
        return res.status(403).json({ message: 'Invalid token or token expired. Please login again' });
      } else {
        // Check if the user is soft-deleted
        const user = await userModel.getUserById(login.id);
  
        if (!user || user.deleted) {
          return res.status(401).json({ message: 'User is deleted or does not exist' });
        }
  
        req.login = login;
        next();
      }
    });
};

