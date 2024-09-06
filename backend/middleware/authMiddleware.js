import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {

  let token;

  token = req.cookies.jwt;
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug line

  if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

         req.user = await User.findById(decoded._id).select('-password');
         console.log('Decoded User ID:', decoded.id);
         console.log('User:', req.user);


         next();
      } catch (error) {
          res.status(401);
          throw new Error('Not authorized, invalid token');

      }
  } else {
      res.status(401);
      throw new Error('Not authorized, no token');
  }
});
  

export default protect;
