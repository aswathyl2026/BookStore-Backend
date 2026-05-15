const { model } = require('mongoose');
const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPE_SK);
const { GoogleGenerativeAI } = require("@google/generative-ai");
//add book
exports.addBookController = async (req, res) => {
    console.log("inside add book controller");
    //get details from body
    const { title,
        author,
        imageURL,
        pages,
        price,
        discountPrice,
        abstract,
        publisher,
        isbn,
        language,
        category } = req.body

    const uploadImages = req.files.map(item => item.filename)
    const sellerMail = req.payload
    console.log(title,
        author, imageURL, pages, price, discountPrice, abstract, publisher, isbn, language, category);
 
    //check book existing
    const existingBook = await books.findOne({ title, sellerMail })
    //if book exist send denied response
    if (existingBook) {
        res.status(409).json("The book is alredy exist...actoon denied")
    }
    //else add book to db and send success response
    else {
        const newBook = await books.create({
            title, author, imageURL, pages, price, discountPrice, abstract, publisher, isbn, language, category, uploadImages, sellerMail
        })
        res.status(201).json(newBook)
    }

}

//get latest 4 book
exports.getHomeBookController=async(req,res)=>{
    console.log("inside getHomeBookController");
    const homeBook=await books.find().sort({_id:-1}).limit(4)
    res.status(200).json(homeBook)
    
}
//get all user uploaded books except the book uploaded by the logined user
exports.getAllBookController=async(req,res)=>{
    console.log("inside getAllBookController");
    const loginMail=req.payload
    const searchKey=req.query.search
    const allBook=await books.find({sellerMail:{$ne:loginMail},title:{$regex:searchKey,$options:"i"},status:"approved"})
    res.status(200).json(allBook)
    
}
//get books uploaded by the logined user
exports.getUserBookController=async(req,res)=>{
    console.log("inside getUserBookController");
    const loginMail=req.payload
    const userBook=await books.find({sellerMail:loginMail})
    res.status(200).json(userBook)
    
}
//get books brought by the logined user
exports.getUserBoughtBookController=async(req,res)=>{
    console.log("inside getUserBookController");
    const loginMail=req.payload
    const userBoughtBook=await books.find({buyerMail:loginMail})
    res.status(200).json(userBoughtBook)
    
}
//remove book by a user
exports.removeUserUploadBookController=async(req,res)=>{
    console.log("inside removeUserUploadBookController");
    const loginMail=req.payload
    const {id}=req.params
    const removeBook=await books.findByIdAndDelete({_id:id})
    res.status(200).json(removeBook)
    
}
//get single book to view
exports.vieBookController=async(req,res)=>{
    console.log("inside viewBookController");
    
    const {id}=req.params
    const viewBook=await books.findById({_id:id})
    res.status(200).json(viewBook)
    
}
//get all book:admin side
//update book status:admin side
//book payment
exports.bookPaymentController=async(req,res)=>{
    console.log("inside bookPaymentController");
    const buyerMail=req.payload
    const {id}=req.params
    const bookDetails=await books.findById({_id:id})
    bookDetails.buyerMail=buyerMail
    bookDetails.status="sold"
    await bookDetails.save()
    //checkout

    const line_items=[
        {
        price_data:{
            currency:"usd",
            product_data:{
            name:bookDetails.title,
            description:`${bookDetails.author},${bookDetails.publisher}`,
            images:bookDetails.uploadImages,
            metadata:{
                title:bookDetails.title,author:bookDetails.author,price:bookDetails.discountPrice
            }
        },
        unit_amount:Math.round(bookDetails.discountPrice*100)
        },
        quantity:1
       
        }
    ]
    const session = await stripe.checkout.sessions.create({
  success_url: 'http://localhost:5173/success',
  cancel_url:'http://localhost:5173/cancel',
  line_items,
  mode: 'payment',
  payment_method_types:['card']
});
console.log(session);
res.status(200).json({checkoutURL:session.url})
}
//get all book
exports.viewAllBooksController=async(req,res)=>{
    console.log("viewAllBooksController");
    const allBooks=await books.find()
    res.status(200).json(allBooks)
    
}

//update status
exports.updateBookStatusController=async(req,res)=>{
    console.log("inside updateBookStatusController");
    
    const {id}=req.params
    const bookDetails=await books.findById({_id:id})
    bookDetails.status="approved"
    await bookDetails.save()
    res.status(200).json(bookDetails)
    
}

exports.generateAIBookController=async(req,res)=>{
    console.log('Inside generateAIBookController ');
    const genAPI=new GoogleGenerativeAI(process.env.GEMINI_API)
    const {title}=req.body
    const model=genAPI.getGenerativeModel({
        model:"gemini-2.5-flash"
    })
    const result=await model.generateContent(`give me a short abstract of ${title} `)
    console.log(result)
     const reply=result.response
    res.status(200).json({
        success:true,
        user:title,
       content:reply.candidates[0].content.parts[0].text
    })
}

