import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import User from "./models/userModel.js";
import bcrypt from "bcrypt";
const saltRounds = 10;
const app = express();
const PORT = 3000;
mongoose.connect("mongodb://localhost:27017/userDB")


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.get('/',function(req,res){
    res.render('home')
});
app.get('/login',(req,res)=>{
    res.render('login')
});
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post("/register",(req,res)=>{
    console.log(req.body);
    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
      const newUser = new User({
        email: req.body.username,
        password: hash
    });
    console.log(`newUser.email --> ${newUser.email}`);
    console.log(`newUser.password --> ${newUser.password}`);
    
    try {
        newUser.save()
         console.log("new user saved successfully");
         res.render("secrets")
    } catch (error) {
      console.log(err)  
    }
    })



})
app.post('/login', async (req,res) => {
    const { username, password } = req.body;
    try {
      const loginUser = await User.findOne({ email: username });
      console.log({ loginUser });
      // if (loginUser.password !== password) {
      //   throw new Error("Password mismatch!");
      // }
      bcrypt.compare(password,loginUser.password,(err,result)=>{
        if (result!== true) {
          throw new Error("Password mismatch!");
        }
      })
      console.log("loginUser.password",loginUser.password)
      res.render("secrets")
    } catch (error) {
      console.log(error)  
      res.status(401).json({ error: error.message.toString() });
    }
})

app.listen(PORT,()=>console.log(`app started on port ${PORT}`))