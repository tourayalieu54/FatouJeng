import express from 'express';
import Attendance from '../models/attendance.js';
import { authMiddleware } from '../middlewares/middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET all attendance for an employee
router.get('/employee/:id', async (req, res) => {
  try {
    const recs = await Attendance.find({ employeeId: req.params.id });
    res.json(recs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
});

// GET attendance by date
router.get('/employee', async (req, res) => {
  const { employeeId, date } = req.query;
  try {
    const day = new Date(date);
    const startOfDay = new Date(day);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const rec = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    if(!rec){
      res.status(404).json({ message: 'No attendance record found for this employee on this date!' });
    }
    res.json(rec);
  } catch {
    res.status(500).json({ message: 'Error retrieving attendance' });
  }
});

// POST clock-in
router.post('/clock-in', async (req, res) => {
  const { employeeId } = req.body;
  try {
    const day = new Date();
    const startOfDay = new Date(day);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const rec = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (rec) {
      return res.status(400).json({ message: 'You have already clocked in today!' });
    } 
    const att = new Attendance({
      employeeId,
      date: new Date(),
      clockInTime: new Date(),
      status: 'Present'
    });
    await att.save();
    res.status(201).json(att);
  } catch (err) {
    res.status(400).json({ message: 'Failed to clock in', details: err.message });
  }
});

// PUT clock-out
router.put('/clock-out/:mainId', async (req, res) => {
  try {
    const att = await Attendance.findOne({ mainId: req.params.mainId});
    if (!att) return res.status(404).json({ message: 'Attendance not found' });
    if (att.clockOutTime) {
      return res.status(400).json({ message: 'Clock-out already recorded' });
    }
    att.clockOutTime = new Date();
    await att.save();
    res.json(att);
  } catch (err){
    res.status(500).json({ message: `Failed to clock out: ${err}`});
  }
});

// PUT edit attendance
router.put('/edit', async (req, res) => {
  try {
    const attendance = await Attendance.findOne({mainId: req.body.mainId});
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    const updated = await Attendance.findByIdAndUpdate(attendance._id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(400).json({ message: 'Failed to update attendance' });
  }
});

export default router;
