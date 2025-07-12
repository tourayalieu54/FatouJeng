import express from 'express';
import AppUser from '../models/appUser.js';
import Employee from '../models/employee.js';
import { AuthService } from '../authService/authService.js';
import { authMiddleware, authorizeRole } from '../middlewares/middleware.js';

const router = express.Router();

// Public: Login
router.post('/login', async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    const user = await AppUser.findOne({ emailAddress });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Invalid username/password' });
    }
    const token = AuthService.generateToken(user._id, user.emailAddress, user.role).trim();
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Public: Signup
router.post('/signup', async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    if (await AppUser.findOne({ emailAddress })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const employee = await Employee.findOne({emailAddress});
    if (!employee) {
      return res.status(400).json({ message: 'No existing employee has that email address, please provide your employee email address!' });
    }

    const employeeId = employee.mainId;
    let role;
    if(employee.position.toLowerCase() === 'ceo') {
      role = 'ADMIN';
    }
    else{
      role = 'STAFF';
    }

    const newUser = new AppUser({ emailAddress, password, role: role, employeeId: employeeId });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: 'Failed to create user' });
  }
});

// Protected: List all users (admin only)
router.get('/users', authMiddleware, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const users = await AppUser.find();
    if (!users.length) return res.status(204).send();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router;
