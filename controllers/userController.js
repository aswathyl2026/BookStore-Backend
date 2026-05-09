const bcrypt = require('bcrypt');
const users=require('../models/userModel')
const jwt=require('jsonwebtoken')

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

//login
exports.loginController=async(req,res)=>{
    console.log("inside login controller");
    console.log(req.body);
    const {email,password}=req.body
    //check email is exist
    const existingUser=await users.findOne({email})
   if(existingUser){
     const isPasswordMatch=await bcrypt.compare(password,existingUser.password)
     if(isPasswordMatch){
        const token=jwt.sign({userMail:email,role:existingUser.role},process.env.JWTSECRET)
        res.status(200).json({user:existingUser,token})
     }else{
       res.status(409).json("invalid email / password")
     }
   }else{
      //if not present
       res.status(409).json("invalid email... please Register to access Bookstore")
   }
    
    //res.status(201).json("register request")
    
}

//googlelogin
exports.googleLoginController=async(req,res)=>{
    console.log("inside google log controller");
   
    const {email,password,username,picture}=req.body
   
    //check email is exist
    const existingUser=await users.findOne({email})
   if(existingUser){
    const token=jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
     res.status(200).json({user:existingUser,token})
   }else{
      //if not present create new user
       let encryptPassword= await bcrypt.hash(password,10)
      const newUser=await users.create({username,email,password: encryptPassword,picture})
      const token=jwt.sign({userMail:newUser.email,role:newUser.role},process.env.JWTSECRET)
       res.status(200).json({user:newUser,token})
   }
    
    //res.status(201).json("register request")
    
}
//user/admin  edit-------------
exports.userEditController=async(req,res)=>{
    console.log("inside user Admin Editcontroller");
    console.log(req.body)
    console.log(req.file)
    console.log(req.payload);
    console.log(req.params);
    const {username,password,bio,picture,role}=req.body
    const encryptPassword=await bcrypt.hash(password,10)
    const {id}=req.params
    const{email}=req.payload
    const updatePicture=req.file?req.file.filename:picture
   const updateUser=await users.findByIdAndUpdate({_id:id},{
     username,
    email,
    password: encryptPassword,
    picture: updatePicture,
    bio,
    role
   },{new:true})
    
    res.status(200).json(updateUser)
    

    
}
//admin edit--------------
