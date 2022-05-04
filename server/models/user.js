const mongoose = require("mongoose");
const { use } = require("../routes/userApi");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    default:"customer"
  },
  date:{
    type:Date,
    default:Date.now(),
  }
},{ timestamps: true });

const user = mongoose.model("User",userSchema);

module.exports = user