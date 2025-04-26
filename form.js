import mongoose from "mongoose";
const FormSchema = new mongoose.Schema({
    email : String,
    password : String
});

const Form = mongoose.model('gmail', FormSchema);

export default Form;
