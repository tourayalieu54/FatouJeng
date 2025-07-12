import mongoose from 'mongoose';
import seq from 'mongoose-sequence';

const attendanceSchema = new mongoose.Schema({
    mainId: {type: Number, unique: true},
    clockInTime: {type: Date, required: true},
    clockOutTime: {type: Date},
    status: {type: String, enum:['Present', 'Absent', 'Late'], default: 'Present', required: true},
    employeeId: {type: Number, required: true},
    date: {type: Date, required: true}
})

const AutoIncrement = (seq)(mongoose);
attendanceSchema.plugin(AutoIncrement, {inc_field: "mainId", id: 'attendace_main_id'});

const Attendance = mongoose.model('attendance', attendanceSchema);
export default Attendance;