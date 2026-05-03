const bcrypt = require('bcrypt');
const users=require('../models/userModel')

//register
exports.registerController=async(req,res)=>{
    console.log("inside register controller");
    console.log(req.body);
    const {username,email,password,role}=req.body
    //check email is exist
    const existingEmail=await users.findOne({email})
   if(existingEmail){
    res.status(409).json("user alredy exist!!!! please login")
   }else{
      let encryptPassword= await bcrypt.hash(password,10)
      const newUser=await users.create({username,email,password: encryptPassword})
      res.status(201).json(newUser)
   }
    
    //res.status(201).json("register request")
    
}