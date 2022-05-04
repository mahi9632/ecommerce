const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const {check, validationResult} = require("express-validator");
const productModel = require("../models/product");

router.post("/",
[auth,
  [
    check("name","Name ios required").not().isEmpty(),
    check("description","description ios required").not().isEmpty(),
    check("category","category ios required").not().isEmpty(),
    check("price","price ios required").not().isEmpty(),
    check("quantity","quantity ios required").not().isEmpty()

  ]
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.statusCode(400).json({errors: errors.array() });
    }
    try {
      const {name,description,category,price,quantity,brand} = req.body;
      const newProduct = new productModel({
        userId:req.user.id,
        name,
        description,
        category,
        price,
        brand,
        quantity,
      });
      const product = await newProduct.save();
      res.json({product});
    } catch(err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
});
router.get("/",async(req,res)=>{
try{
  const products = await productModel.find();
  res.json(products)
} catch(err) {
  console.log(err.message);
  res.status(500).send("server error");
}
});

router.get("/:id",async (req,res)=>{
  try{
    const product = await productModel.findById(req.params.id);
    if(!product){
      return res.status(400).json({msg:"product not found"});
    }
    res.send(product);
  } catch(err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
