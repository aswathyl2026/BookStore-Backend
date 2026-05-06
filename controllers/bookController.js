const books = require('../models/bookModel')

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
//get all user uploaded books
//get books uploaded by the logined user
//get books brought by the logined user
//remove book by a user
//get single book to view
//get all book:admin side
//update book status:admin side
//book payment