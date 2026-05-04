const express=require("express")
const userController =require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")

const router=express.Router()
router.post('/register',userController.registerController)

router.post('/login',userController.loginController)

router.post('/google-login',userController.googleLoginController)

router.put('/user/:id',authMiddleware,userController.userEditController)

module.exports=router