const express = require('express')
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

const authToken = require('../middlewares/AuthToken');

const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB
})
db.connect();

//Gets posts for home page
router.get('/posts',(req,res)=>{
    const sql = "SELECT P.postID,P.title,P.content,P.image_1,P.postedDate,C.catogeryName,U.username,U.userProfile FROM posts AS P INNER JOIN catogery AS C ON P.catogeryID = C.catogeryID INNER JOIN user AS U ON P.userID = U.userID";
    db.query(sql,(error,result)=>{
        if(error){
            console.log(error.message)
            res.status(404).json({Message:"Database Error",error})
        }else{
            res.status(200).json(result);
        }
    })
})

//Create a new blog
router.post('/addBlog',authToken,(req,res)=>{
    const sql = "INSERT INTO posts (title,content,image_1,image_2,image_3,postedDate,catogeryID,userID) VALUES (?,?,?,?,?,?,?,?)";
    const title = req.body.title;
    const content = req.body.content;
    const image_1 = req.body.image_1;
    const image_2 = req.body.image_2;
    const image_3 = req.res.image_3;
    const postedDate = req.body.postedDate;
    const catogeryID = req.body.catogeryID;
    const userID = req.body.userID;

    db.query(sql,[title,content,image_1,image_2,image_3,postedDate,catogeryID,userID],(err,result)=>{
        if(err){
            res.status(402).json({Message:"Database error",err})
            console.log(err.message)
        }else{
            res.status(200).json({Message:"Blog is successfully added."})
        }
    })
})

//-------------------------------------------------------------------------------------------------------
//Get selected post
router.get('/posts/:postID',(req,res)=>{
    const sql = "SELECT P.postID,P.title,P.content,P.image_1,P.image_2,P.image_3,P.postedDate,P.views,U.username FROM posts AS P INNER JOIN user AS U ON P.userID = U.userID WHERE postID = ?";
    const postID = req.params.postID;

    db.query(sql,[postID],(err,result)=>{
        if(err){
            res.status(500).json({Message:"Database Error"})
        }else{
            res.status(200).json(result)
        }
    })
})


//---------------------------------------------------------------------------------------------------------
//Update selected Blog post
router.put('/updateBlog/:postID',authToken,(req,res)=>{
    const sql = "UPDATE posts SET title = ?,content = ?, image_1 = ?, image_2 = ?, image_3 = ?, postedDate = ?, catogeryID = ? WHERE postID = ?";
    const title = req.body.title;
    const content = req.body.content;
    const image_1 = req.body.image_1;
    const image_2 = req.body.image_2;
    const image_3 = req.body.image_3;
    const postedDate = req.body.postedDate;
    const catogeryID = req.body.catogeryID;
    const postID = req.params.postID;

    db.query(sql,[title,content,image_1,image_2,image_3,postedDate,catogeryID,postID],(err,result)=>{
        if(err){
            res.status(500).json({Message:"Database Error"})
        }else{
            res.status(200).json({Message:"Updated"})
        }
    })
})

//-------------------------------------------------------------------------------------------------------------
//Delete selected blog
router.delete('/deleteBlog/:postID',authToken,(req,res)=>{
    const sql = "DELETE FROM posts WHERE postID = ?";
    const postID = req.params.postID

    db.query(sql,[postID],(err,result)=>{
        if(err){
            res.status(500).json({Message:"Database Error"})
        }else{
            res.status(200).json({Message:"Post is deleted"})
        }
    })
})

//---------------------------------------------------------------------------------------------------------
//Gets posts related category
router.get('/catogery/:catogeryName',(req,res)=>{
    const sql = "SELECT P.postID,P.title,P.content,P.image_2,P.postedDate,C.catogeryName,U.username,U.userProfile FROM posts AS P INNER JOIN catogery AS C ON P.catogeryID = C.catogeryID INNER JOIN user AS U ON P.userID = U.userID WHERE C.catogeryName = ?";
    const catogeryName = req.params.catogeryName
    db.query(sql,[catogeryName],(error,result)=>{
        if(error){
            console.log(error.message)
            res.status(404).json({Message:"Database Error",error})
        }else{
            res.status(200).json(result);
        }
    })
})
module.exports = router

