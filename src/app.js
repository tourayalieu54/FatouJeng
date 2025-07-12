import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/appUser.route.js';
import employeeRoutes from './routes/employee.route.js';
import attendanceRoutes from './routes/attendance.route.js';


// start the database
connectDB();

// express app
const app = express();


app.use(cors({
  origin: ['https://fatoufrontend.vercel.app'], // your frontend domain
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Role']
}));


app.use(express.json())


// Route registration
app.use( authRoutes);
app.use('/api', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

