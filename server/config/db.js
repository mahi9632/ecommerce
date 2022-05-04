const mongoose = require('mongoose');
const config = require("./keys");
const db = config.mongoURI;

const connectDb = async () =>{
  try{
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to database");
  } catch (err) {
    console.log(err);
    console.log("connection failed");
    process.exit(1);
  }
}

module.exports = connectDb;