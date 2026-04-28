//register
exports.registerController=async(req,res)=>{
    console.log("inside register controller");
    console.log(req.body);
    
    res.status(201).json("register request")
    
}