const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

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
app.get("/",(req,res)=>res.sendFile(__dirname + "/Home.html"));



//============================REGISTER PAGE==============================

// render register page
app.get("/Register",(req,res)=>res.sendFile(__dirname + "/Register.html"));

app.post("/Register",function(req,res){
    console.log("inside register");
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

app.get("/Login",(req,res)=>res.sendFile(__dirname + "/Login.html"));

app.post("/Login",function(req,res){
    console.log("inside login");
    const input_email = req.body.email;
    User.findOne({email : input_email},function(err,foundUser){
        if(err){console.log(err);}
        else
        {
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if(result == true)
                {
                    console.log("found user");    
                    //TODO -- create home page of user depending upon type and put the patch below
                    res.redirect("/");
                }
                else
                {
                    console.log("not found");
                }
            });
        }
    });



});

//============================LOGIN PAGE END==============================

app.listen(3000,() => console.log("server started on port 3000"));