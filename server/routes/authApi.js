const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const userModal = require("../models/user");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { jwtSecrete } = require("../config/keys");
const {check, validationResult} = require("express-validator");

router.get("/", auth, async(req,res)=>{
  try{
    const userinfo = await userModal.findById(req.user.id).select("-password");
    res.json(userinfo);
  } catch(err){
    console.log(err.message);
  }
});


router.post("/",
[
  check("email", "please enter a valid email").isEmail(),
  check("password","password is required").exists()
],
async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    return res.status(400).json({errors:errors.array()});
  }
  try{
    const {email,password} = req.body;
    let user = await userModal.findOne({email: email})
    if(!user){
      return res
      .status(400)
      .json({errors:[{msg:"Inavalid Username or Password"}]})
    }
    const match = await bcrypt.compare(password, user.password);

    // if(!match){
    //   return res
    //   .status(400)
    //   .json({errors:[{msg:"Inavalid Username or Password"}]})
    // }
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