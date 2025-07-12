import mongoose from "mongoose";
import seq from "mongoose-sequence"
import bcrypt from 'bcrypt'

const AutoIncrement = (seq)(mongoose);

const appUserSchema = new mongoose.Schema({
    mainId: {type: Number, unique: true},
    emailAddress: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type:String, required: true},
    employeeId: {type: Number, required: true}
})

appUserSchema.plugin(AutoIncrement, {inc_field: 'mainId', id: 'user_main_id'});

// Middleware for hashing the password before saving
appUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to validate the password
appUserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const AppUser = mongoose.model('appUser' ,appUserSchema)

export default AppUser;