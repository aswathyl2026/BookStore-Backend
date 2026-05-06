const express=require("express")
const userController =require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const multerMiddleware = require("../middlewares/profileMulterMiddleware")
const  bookController= require("../controllers/bookController")


const router=express.Router()
router.post('/register',userController.registerController)

router.post('/login',userController.loginController)

router.post('/google-login',userController.googleLoginController)
router.get('/home-books',bookController.getHomeBookController)
//--------------user----Authorised user---------------------------

router.put('/user/:id',authMiddleware, multerMiddleware.single('picture'),userController.userEditController)
//add book
router.post('/books',authMiddleware, multerMiddleware.array('uploadImages',3),bookController.addBookController)

module.exports=router