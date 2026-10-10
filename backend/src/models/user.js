import mongoose from "mongoose";
const {Schema} = mongoose;
 
const userschema = new Schema({
    firstname : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 20,
    },
     lastname:{
        type : String,
        minLength : 3,
        maxLength : 20,
     },
    points: {
        type: Number,
        default: 0,
    },
    bio: {
        type: String,
        maxLength: 200,
        trim: true,
    },
    linkedIn: {
        type: String,
        trim: true,
    },
    Twitter: {
        type: String,
        trim: true,
    },
     email:{
        type : String,
        required : true,
        unique : true,
        trim: true,
        lowercase : true,
        immutable : true,
     },
     age:{
        type : Number,
        min : 10,
        max:70,
     },
     role:{
        type : String,
        enum : ['admin','user'],
        default : 'user',
     },
     problemsolved: [{
    type: Schema.Types.ObjectId,
    ref: 'Problem'
}],
     password:{
         type : String,
         required : true,
     }
}
,{
    timestamps : true,
 })

 const User = mongoose.model('User', userschema);
export default User;