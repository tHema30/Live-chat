import express from 'express';
import { registerUser, authUser ,getUsers} from '../controllers/authController.js';
import protect  from '../middleware/authMiddleware.js';

const router = express.Router();


// Register a new user
router.post('/register', registerUser);

// Authenticate a user
router.post('/login',authUser);
// Get all users (Admin)
router.get('/users', getUsers);


export default router;
