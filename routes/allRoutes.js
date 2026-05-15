const express=require("express")
const userController =require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const multerMiddleware = require("../middlewares/profileMulterMiddleware")
const  bookController= require("../controllers/bookController")
const adminMiddleware = require("../middlewares/adminMiddleware")


const router=express.Router()
router.post('/register',userController.registerController)

router.post('/login',userController.loginController)

router.post('/google-login',userController.googleLoginController)
router.get('/home-books',bookController.getHomeBookController)
//--------------user----Authorised user---------------------------

router.put('/user/:id',authMiddleware, multerMiddleware.single('picture'),userController.userEditController)
//add book
router.post('/books',authMiddleware, multerMiddleware.array('uploadImages',3),bookController.addBookController)
//book except logined user books
router.get('/all-books',authMiddleware,bookController.getAllBookController)
//user upload book
router.get('/user-books',authMiddleware,bookController.getUserBookController)
//user bought book
router.get('/bought-books',authMiddleware,bookController.getUserBoughtBookController)
//remove book
router.delete('/books/:id',authMiddleware,bookController.removeUserUploadBookController)
//view single book details
router.get('/books/:id',authMiddleware,bookController.vieBookController)

//vbook detail from gemini
router.post('/book-ai',authMiddleware,bookController.generateAIBookController)
//payment
router.put('/books/:id/buy',authMiddleware,bookController.bookPaymentController)

//admin
router.put('/profile/:id',adminMiddleware, multerMiddleware.single('picture'),userController.userEditController)
//get all user
router.get('/users',adminMiddleware, multerMiddleware.single('picture'),userController.getAllUsersController)
//getAllbooks
router.get('/bookList',adminMiddleware,bookController.viewAllBooksController)
//update status
router.put('/book/:id',adminMiddleware,bookController.updateBookStatusController)
module.exports=router