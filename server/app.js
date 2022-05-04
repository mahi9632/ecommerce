
const express = require("express")
const app = express();
const PORT = process.env.NODE_ENV || 8000;
const connectDb = require('./config/db');

connectDb();
app.use(express.json({extended : true}))
app.use("/api/auth", require("./routes/authApi"))
app.use("/api/users",require("./routes/userApi"))
app.use("/api/products",require("./routes/productsApi"))

app.get('/',function(req,res){
  res.send("heelo")
})


app.listen(PORT,()=>{
  console.log(`server started on ${PORT}`);
})