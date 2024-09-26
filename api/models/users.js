import mongoose from 'mongoose'

//creating schema according to form data

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 4,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 4
    }
})
//we need to define model with collection name inside string and userShema
const userModel = new mongoose.model('users',userSchema); 

//export collection which include collection name and schema and export default modeel is the new syntax against module.exports
export default userModel;
