const mongoose=require('mongoose')
const connectionString=process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("Data base connection sucessful");
    
}).catch(error=>{
    console.log("Database connection failed");
    console.log(error);
    
    
})