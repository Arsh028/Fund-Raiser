const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));//put all css in public file in order for it to work

//connect to the mongodb database 
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true , useUnifiedTopology: true });

//create schema of the user
const UserSchema = new mongoose.Schema(
    {
        fname  : String,
        lname  : String,
        email : String,
        typeOfUser : String,
        password : String
    }
);

//create collection name User (table)
var User = new mongoose.model("User", UserSchema);

// render home page
app.get("/",(req,res)=>res.render("pages/Home"));


//============================REGISTER PAGE==============================

// render register page
app.get("/Register",(req,res)=>res.render("pages/Register"));

app.post("/Register",function(req,res){
    const v1 = req.body.pass;
    const v2 = req.body.newpass;
    if(v1 == v2)
    {
        bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
            const newUser = new User(
                {
                    fname  : req.body.fname,
                    lname  : req.body.lname,
                    email : req.body.email,
                    typeOfUser : req.body.typeOfUser,
                    password : hash
                }
            );
            newUser.save(function(err){
                if(err){
                    console.log("There was an error "+err);
                    res.redirect("/Register");
                }
                else
                {
                    //TODO -- create home page of user depending upon type and put the patch below
                    console.log(req.body.email + " got registered");
                    res.redirect("/");
                }
            });
        });
    }
    else
    {
        console.log("pass didnt match");
        res.redirect("/Register");
    }
});

//============================REGISTER PAGE END==============================

//============================LOGIN PAGE=============================

//render login page
app.get("/Login",(req,res)=>res.render("pages/Login"));

app.post("/Login",function(req,res){
    console.log("inside login");
    const input_email = req.body.email;
    User.findOne({email : input_email},function(err,foundUser){
        if(err){console.log("user not found");res.redirect("/Register");}
        else
        {
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if(result == true)
                {
                    console.log(foundUser.email+" user logged in");  
                    //TODO -- create home page of user depending upon type and put the patch below
                    res.redirect("/");
                }
                else
                {
                
                    //TODO -- show error of this
                    console.log("password incorrect");
                }
            });
        }
    });



});

//============================LOGIN PAGE END==============================

app.listen(3000,() => console.log("server started on port 3000"));