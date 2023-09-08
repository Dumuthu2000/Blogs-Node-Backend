const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = async(req,res,next)=>{
    const token = await req.header('Authorization').split(' ')[1];
    if(!token){
        res.status(400).json({Message:"Token doesn't exists"});
    }
    const payLoad = jwt.verify(token,process.env.SECRET_KEY);
    try{
        req.user = payLoad;
        next();
    }catch(error){
        res.status(400).json({Message:"token is invalid"});
    }
}