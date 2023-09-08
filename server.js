const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');


//Server configuration
const port = 8080
app.listen(process.env.PORT || port,()=>{
    try{
        console.log(`Server is running on port ${port}`);
    }catch{
        console.log("Server configuration error");
    }
})

//Middlewares
app.use(express.json());
app.use(cors());

//User routes
const UserRouter = require('./Routers/UserRouter');
app.use('/',UserRouter);

const postRouter = require('./Routers/PostsRouter');
app.use('/',postRouter)

