const express = require('express')
const app = express();
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authToken = require('../middlewares/AuthToken');


//Database configuration
const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB
})

db.connect();

//Register a user
router.post('/register',(req,res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const userProfile = req.body.userProfile
    const  saltRounds = 10;

    bcrypt.hash(password,saltRounds,(err,hashPassword)=>{
        if(err){
            console.log(err)
        }else{
            const sql = "INSERT INTO user(username,email,password,userProfile) VALUES (?,?,?,?)";

        db.query(sql,[username,email,hashPassword,userProfile],(err,result)=>{
            if(err){
                res.status(500).json({Message:err})
             }else{
                 res.status(200).json({Message:"User is registered"})
            }
    })
        }
    })
})
//--------------------------------------------------------------------------------------------------------------------------------------
//User logging
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const sql = "SELECT * FROM user WHERE email = ?";

    //Generating a token
    const generateJwt=()=>{
        const payLoad={email: req.body.email}
        const secretKey = process.env.SECRET_KEY;
        const options={expiresIn:"1hr"}
        
        //Create the token using sign in method
        const token = jwt.sign(payLoad,secretKey,options);
        return token;
    }

    db.query(sql,[email],(err,result)=>{
        if(err){
            res.status(500).json({Message:err})
        }else{
            if(result.length > 0){                
                const storedHashPassword = result[0].password
                bcrypt.compare(password,storedHashPassword,(err,isMatch)=>{
                    if(err){
                        res.status(500).json({Message:"Password comparison error"})
                    }else{
                        if(isMatch){
                            const token = generateJwt();
                            res.status(200).json({Message:"Login successfully",token});
                        }else{
                            res.status(500).json({Message:"Incorrect password"})
                        }
                    }
                })
            }else{
                res.status(400).json({Message:"User not found"})
            }
        }
    })
})

//---------------------------------------------------------------------------------------------------------------------------
router.get("/users",authToken,(req,res)=>{
        const sql = "SELECT * FROM user";
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ Message: 'Database error' });
            }else{
                res.status(200).json(result);
            }
        });
    });

//-----------------------------------------------------------------------------------------------------
//Create a post
router.post('/addPost',authToken,(req,res)=>{
    const sql = "INSERT INTO posts (title,description) VALUES (?,?)";
    const title = req.body.title;
    const description = req.body.description;

    db.query(sql,[title,description],(err,result)=>{
        if(err){
            res.status(404).json({Message:"Database Error",err})
        }else{
            res.status(200).json({Message:"Post added successfully"})   
        }
    })
})
//------------------------------------------------------------------------------------------------
router.get('/',(req,res)=>{
    const sql = "SELECT*FROM posts";
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err.message)
        }else{
            res.status(200).json(result);
        }
    })
})
module.exports = router