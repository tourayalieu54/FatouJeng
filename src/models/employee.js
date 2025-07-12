import mongoose from "mongoose";
import seq from "mongoose-sequence";

const AutoIncrement = (seq)(mongoose);


const employeeSchema = new mongoose.Schema({
  mainId: {type: Number, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  emailAddress: { type: String, required: true, unique: true },
  position: { type: String, required: true },
});


employeeSchema.plugin(AutoIncrement, { inc_field: "mainId", id: 'employee_main_id'});


const Employee = mongoose.model("employee", employeeSchema);

export default Employee;
