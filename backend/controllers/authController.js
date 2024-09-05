import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler (async (req, res) =>{
  const { email, password } = req.body;
  
  const user = await User.findOne({ email});
  
  if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
    

      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.token,

          success:true, 
      });
  } else {
      res.status(401);
      throw new Error('Invalid email or password');
  }
  
});

// Admin get all user details
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});


export { registerUser, 
         authUser,
         getUsers
         };