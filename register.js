import mongoose from "mongoose";
const FormSchema = new mongoose.Schema({
    name : String,
    dob: Date,
    aadhar : Number,
    password: String
});

const register = mongoose.model('Register', FormSchema);

export default register;
