require('dotenv').config()// loading env contebt to process.env
const express=require('express')
const cors=require('cors')
const routes=require("./routes/allRoutes")

//create server
const server=express()
//cors
server.use(cors())
//set to json format
server.use(express.json())
//routes
server.use(routes)
//set up port for server
const PORT=process.env.PORT
//start server to listren client
server.listen(PORT,()=>{
    console.log("Server started ");
    console.log(process.env.PORT);
    
})
server.get('/',(req,res)=>{
    res.status(200).send(`<h1>Server started</h1>`)
})

