import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from './models/users.js'
import models from './models/post.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import fs from 'file-system'
import { fileURLToPath } from 'url'  //This is a method from Node.js' url module. It's used to convert file URLs into file paths. ES modules (enabled by "type": "module" in package.json) use URLs for file paths, but in many cases, you need the file system path (especially for filesystem operations). This function helps convert a file: URL to a regular file path.
import path from 'path'  // This is the path module from Node.js, which provides utilities to work with file and directory paths. It’s useful for joining paths, getting directory names, etc.
import { error } from 'console';
import dotenv from 'dotenv';

 

const app = express();
const port = 4003;
const salt = bcrypt.genSaltSync(10)//generates salt or strong strings texts with 10 characters which can be used for password storing in database
const secret = 'bdafejhghrfewgi34h34h3h';
const multerMiddleWare = multer( {dest: 'uploads/'} )
const corsOPtions = {origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3002'],
                  credentials:true,};
const __fileName = fileURLToPath(import.meta.url); // In ES modules, import.meta is a special object that contains metadata about the current module. import.meta.url returns the URL of the current module file in the form of a file: URL (e.g., file:///path/to/your/file.js).
//This converts the file URL (import.meta.url) into a file path that is usable in the filesystem (e.g., /path/to/your/file.js on Unix or C:\path\to\your\file.js on Windows). It gives you the equivalent of __filename in ES modules, which is the full path of the current module file.
const __dirname = path.dirname(__fileName);  //path.dirname() extracts the directory name from the full file path (__filename). It gives you the equivalent of __dirname in ES modules, which is the directory containing the current file.
dotenv.config();
 

app.use(cors(corsOPtions));// used to connect two ports that is frontend port localhost:3000 and backened or api port localhost:4002
app.use(express.json());//middleware
app.use(cookieParser());//used to parse cookies 
app.use('/uploads', express.static(__dirname + '/uploads'));  // This line of code tells Express to serve the static files in the uploads folder when a client makes a request to /uploads. For example, if a file image.png is in the uploads directory, it will be accessible via http://localhost:4003/uploads/image.png.


//connecting the database Mern Blog
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongo atlas is connected"); 
}) 

app.post('/register', async (req, res) =>{
    const {username, password} = req.body;
    const userDoc = await userModel.insertMany({username, 
        password: bcrypt.hashSync(password, salt)}); //the generated salt value is added with password typed in the form and the text along with the password are stored in the database
    res.json(userDoc); 
})
app.post('/login', async (req, res) =>{
    const {username, password} = req.body;
    const userDoc = await userModel.findOne({username}); //we are finding earlist inserted or stored collection with only one value username. then we get our full collection which is earlier stored
    const passOk = bcrypt.compareSync(password, userDoc.password) //we are comparing entered password in /login form with userDoc hash(strong) passowrd in mongodb
     
    if(passOk){
        //this line is to generate token after secret their is one empty curly braces{} which is used to give expiry time
        jwt.sign({username, id: userDoc.id},secret,{}, (err, token) =>{
            if(err){
                throw err;
            }else{
                res.cookie('token', token).json(
                    {id:userDoc.id,
                        username
                    }
                ); //each time user gets logined or make reques tfrom our app we send as a cookie
            }
        }); 
            }else{
                res.json({messege: "login wrong crediniontials"})
            }
})
app.get('/profile', (req, res) =>{
    const {token} = req.cookies;   //The /profile route retrieves the cookies (including the JWT token) from itself this index bakened file and sends them back to the client via res.json(req.cookies).
   
    jwt.verify(token, secret, {}, (err, info) =>{
        if (err) {
            return res.status(403).json({ message: 'Token is invalid' }); 
        } else {
            res.json(info); // Directly return the decoded token info (user data)
        }
    })
 })
app.post('/logout',(req,res) =>{
    res.cookie('token', '').json("ok");
}) 
app.post('/post', multerMiddleWare.single('files'), async (req, res) =>{
   
    const {originalname,path} = req.file;
    const parts = originalname.split('.');// this original name will be splitted based on dots
    const ext = parts[parts.length - 1]; //png value is getted beacause after splitting there is only two values in array so length of the parts is 2 and 2-1 is 1 is png
    const newpath = path + '.' + ext; //to grab .exstension eg png
    fs.renameSync(path, newpath ); //it is asynchronous and filename is renamed from path to newPath
    
    //we are again grabing the token 
    const {token} = req.cookies;   //The /profile route retrieves the cookies (including the JWT token) from itself this index bakened file and sends them back to the client via res.json(req.cookies).
    console.log(token);

    jwt.verify(token, secret,{}, async (err, info) =>{
        if(err){
            throw err;
        }else{ 
            console.log(info)
        }
    const {title, summary, content} = req.body;
    const postDoc = await models.insertMany({
        title,
        summary,
        content,  
        cover: newpath, 
        author: info.id,
    })
    res.json(postDoc);  
});
 
});  

app.put('/post',  multerMiddleWare.single('files'),async (req, res) =>{
    let newPath = 'null';  //declaring a variable and explicitly initializing it with null makes it clear that the variable has been intentionally initialized but currently holds no meaningful value. It also helps avoid issues caused by the variable being undefined.
  if(req.file){
    const {originalname,path} = req.file;
    const parts = originalname.split('.');// this original name will be splitted based on dots
    const ext = parts[parts.length - 1]; //png value is getted beacause after splitting there is only two values in array so length of the parts is 2 and 2-1 is 1 is png
    newPath = path + '.' + ext; //to grab .exstension eg png  
    fs.renameSync(path, newPath ); //it is asynchronous and filename is renamed from path to newPath
  }  
    const {token} = req.cookies;   //The /profile route retrieves the cookies (including the JWT token) from itself this index bakened file and sends them back to the client via res.json(req.cookies).
    
     jwt.verify(token, secret,{}, async (err, info) =>{
        if(err){
            throw err;
        }
    const {id,title, summary, content} = req.body;
    const postDoc = await models.findById(id);

    const authorOk = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    res.json(authorOk);
    if(!authorOk){
        res.status(400).json("you are not the author");
    }
    
        postDoc.title = title; 
        postDoc.summary = summary;     
        postDoc.content = content;
        postDoc.cover= newPath ? newPath : postDoc.cover

        await postDoc.save();
    
     }) 
    })
    
app.get('/post', async (req, res)=>{
    
    res.json(await models.find() //if we want username write only username inside brackets with single quotes
    .populate('author', ['username']) //populate method will populate ie show some extently the author information in the post document in the json response if we want to dislpay only then write username inside brackets
    .sort({createdAt: -1})
    .limit(20)); //to limit number of post ie we are meant to display the post from 0 to 20
}) 


app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await models.findById(id).populate('author', ['username']); 
    res.json(postDoc);
  })

app.post('/comments/:id', async(req, res) => {

    const {id} = req.params;
    const {username, comments} = req.body;
     
    if(id && username && comments){
        const blogExists = await models.findById(id);
        

        if(blogExists){

            //adding comments in posts blog posts which is geted by id 
            const updatedBogs = await models.updateOne(
                { _id: id },
                { $push: { comments: [{comments: comments, username: username }] } }
            )
            
            res.json(updatedBogs);
        }else{
            console.log({messege: 'no blogs to find'});
        }
    }

})

app.get('/comments/:id', async(req, res) => {
    const {id} = req.params;
    //retrieving the comments
    const comments = await models.findById(id).select('comments');  
    //console.log(comments);
    if(comments){
        res.json(comments);
    }else{
        res.json({messege: 'comments annot get fetched'});
    } 
}) 

app.post('/likes', async(req, res) => {

    const {_id, username, liked} = req.body;
    console.log(`on blog post id ${_id} usernamed ${username} have liked in count ${liked}`);

    const blogExists = await models.findById(_id);
    
    if(blogExists){

        //inserting likes we have used set beacause to inserting we
        const updatedBlogs = await models.updateOne(  {_id: _id},
            {$push: {likes: [liked]}},
            )
          res.json({'updated blogs with likes are': updatedBlogs});
      }else{
        res.json('There is no blog exists in this id');
      }
})

app.delete('/delete/:id', async(req, res) => {

    const {id} =req.params;
    const {token} = req.cookies;
   jwt.verify(token, secret, {}, async (err, info)=>{
    if (err){
        throw err;
    }
    
    const deleteDoc = await models.findById(id);
    const authorOk = JSON.stringify(deleteDoc.author) === JSON.stringify(info.id) 
    res.json(authorOk);
   if(!authorOk){
       res.status(400).json("you are not author")
   }else{
   await models.deleteMany(deleteDoc);
   }
   })
})
                       
 
app.listen(port, (req, res) =>{
    console.log(`you are listening to the port ${port}`);
})
   