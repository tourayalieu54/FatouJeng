import express from 'express';
import Employee from '../models/employee.js';
import AppUser from '../models/appUser.js';
import { authMiddleware, authorizeRole } from '../middlewares/middleware.js';

const router = express.Router();

// All routes require authentication
 router.use(authMiddleware);

// GET all employees
router.get('/employees', async (req, res) => {
  try {
    const list = await Employee.find();
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// GET employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET employee by email
router.get('/employees/email/:emailAddress', async (req, res) => {
  try {
    const emp = await Employee.findOne({ emailAddress: req.params.emailAddress });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN only: Create
router.post('/employees', authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create employee', details: err.message });
  }
});

// ADMIN only: Update
router.put('/employees/:id', authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const existing = await Employee.findOne({mainId: req.params.id});
    if (!existing) return res.status(404).json({ message: 'Employee not found' });

    // Sync AppUser email if changed
    if (existing.emailAddress !== req.body.emailAddress) {
      const userAcc = await AppUser.findOne({ emailAddress: existing.emailAddress });
      if (userAcc) {
        userAcc.emailAddress = req.body.emailAddress;
        await userAcc.save();
      }
    }

    Object.assign(existing, req.body);
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update employee', details: err.message });
  }
});

// ADMIN only: Delete
router.delete('/employees/:id', authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const emp = await Employee.findOne({mainId: req.params.id});
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const userAcc = await AppUser.findOne({ emailAddress: emp.emailAddress });
    if (userAcc) await AppUser.deleteOne({ _id: userAcc._id });

    await Employee.deleteOne({ _id: emp._id });
    res.json({ deleted: true });
  } catch {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

export default router;
