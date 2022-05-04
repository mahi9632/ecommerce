const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const monitor = require("nodemon/lib/monitor");
const User = require("../models/user");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { jwtSecrete } = require("../config/keys");


router.get("/",(req,res)=> res.send("user route"));

router.post("/deleteall",
async(req,res)=> {
  try{
    await User.deleteMany();
    console.log('All Data successfully deleted');
    res.json({msg:"all records deleted"})
  } catch (err) {
    console.log(err);
  }
});

router.post("/login",
[
  check("name","Name is require").not().isEmpty(),
  check("email", "please enter a valid email").isEmail(),
  check("password","please have at least 5 charector").isLength({min:5})
],
async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    return res.status(400).json({errors:errors.array()});
  }
  try{
    const {name,email,password} = req.body;
    let user = await User.findOne({email: email})
    if(user){
      return res
      .status(400)
      .json({errors:[{msg:"User already exists"}]})
    }
    user = new User({
      name,
      email,
      password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt)
    user.save();
    const payload = {
      user:{
        id: user.id,
      },
    };
    jwt.sign(payload, jwtSecrete,{expiresIn:3600 * 24},(err,token) =>{
      if(err) throw err;
      res.json({token})
    })
  }catch(error){
    console.log(error)
  }
})

module.exports = router;