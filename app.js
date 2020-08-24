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

const UserSchema = new mongoose.Schema(
    {
        fname  : String,
        lname  : String,
        email : String,
        password : String
    }
);

//create collection name User
var User = new mongoose.model("User", UserSchema);

// render home page
app.get("/",(req,res)=>res.sendFile(__dirname + "/Home.html"));


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
                    password : hash
                }
            );
            newUser.save(function(err){
                if(err){
                    console.log("There was an error "+err);
                    res.redirect("/Register");
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




app.listen(3000,() => console.log("server started on port 3000"));