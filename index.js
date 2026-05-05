require('dotenv').config()// loading env contebt to process.env
const express=require('express')
const cors=require('cors')
const routes=require("./routes/allRoutes")
require("./config/db")
//create server
const server=express()
//cors
server.use(cors())
//set to json format
server.use(express.json())
//routes
server.use(routes)
//handling static file or folder
server.use('/uploads',express.static('./uploads'))
//set up port for server
const PORT=process.env.PORT
//start server to listren client
server.listen(PORT,()=>{
    console.log("Server started ");
    console.log(process.env.PORT);
    
})
//application specific midle ware
server.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})
server.get('/',(req,res)=>{
    res.status(200).send(`<h1>Server started</h1>`)
})

