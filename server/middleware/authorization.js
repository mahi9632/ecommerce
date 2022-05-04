const req = require("express/lib/request");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const config  = require("../config/keys");

module.exports = function(req, res, next){
  const token = req.header("x-auth-token");

  if(!token){
    return res
    .status(401)
    .json({msg:"you dnt hv auth"});
  }
  try{
    const decoded = jwt.verify(token, config.jwtSecrete)
    req.user = decoded.user
    next();
  } catch(err){
    res.status(401).json({msg:"Invalid token"})
  }
}