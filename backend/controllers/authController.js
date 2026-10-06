import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      username,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Normalize email input to match Mongoose schema transformation
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    const user = await User.findOne({ email: normalizedEmail });
     console.log('User found:', user); // Debugging line to check if user is found
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};