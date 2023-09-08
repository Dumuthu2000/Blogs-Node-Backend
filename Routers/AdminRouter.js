const express = require('express')
const app = express();
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const bcrypt = require('bcryptjs')

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
    const  saltRounds = 10;

    bcrypt.hash(password,saltRounds,(err,hashPassword)=>{
        if(err){
            console.log(err)
        }else{
            const sql = "INSERT INTO user(username,email,password,role) VALUES (?,?,?,'admin')";

        db.query(sql,[username,email,hashPassword],(err,result)=>{
            if(err){
                res.status(500).json({Message:err})
             }else{
                 res.status(200).json({Message:"User is registered"})
            }
    })
        }
    })
})

//User logging
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const sql = "SELECT * FROM user WHERE email = ?";

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
                            res.status(200).json(result)
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

module.exports = router