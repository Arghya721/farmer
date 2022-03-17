require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const findOrCreate = require('mongoose-findorcreate');
const flash = require('connect-flash');
var mysql = require('mysql');
app.use(flash());

var message = "";

app.set('view engine', 'ejs');
app.use('/static',express.static('static'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret:"Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const url = process.env.URL;

mongoose.connect(url, {useNewUrlParser: true});

const parameterSchema = new mongoose.Schema({
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    ph: Number,
    temperature: Number,
    mositure: Number,
    plants: String,
    location: String,
});

const Parameter = mongoose.model("Parameter", parameterSchema);

const userSchema = new mongoose.Schema({
    uid: String,
    email: String,
    password: String,
    secret: String,
    displayName: String,
    sensordata : [parameterSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  

app.get("/", (req, res) => {
    res.render("home",{logincheck:req.isAuthenticated()});
});

app.get("/login",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect("/dashboard");
    }else
        res.render("login",{
            errors: req.flash("error"),
        });
});

var connection = mysql.createConnection({
    host               : process.env.HOST,
    user               : process.env.USER,
    password           : process.env.PASSWORD,
    database           : process.env.DATABASE,
    multipleStatements : true
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


function fetchdata(){
    
    try{
        connection.query("SELECT *, datediff(last_update,planted_on) as days FROM stats INNER JOIN cropids  ON cropids.cropid = stats.cropid AND stats.uuid=5678", function (err, result, fields) {
           
            var resultx = Object.values(JSON.parse(JSON.stringify(result)));
            return resultx;
            
          });
    
        }
        catch(e){
            console.log(e);
        }   
}




app.get("/dashboard", isLoggedIn ,(req,res)=>{
    res.render("dashboard",{user:req.user.username});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}






app.get("/signup",(req,res)=>{
    res.render("signup");
    });

  app.post("/signup",(req,res)=>{
    const uid = Math.random().toString(36).substring(7);
    User.register({username: req.body.username , uid: uid}, req.body.password, (err, user)=>{
        if(err){
            res.redirect("/signup");
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/dashboard");
            });
        }
    });
});

function loginalert(res){
    message = "Invalid Username or Password";
    res.redirect("/login");
}

app.post("/login",(req,res)=>{
    
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    
    req.login(user, (err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local",{
                successRedirect: "/dashboard",
                failureRedirect: "/login",
                failureFlash: true
            })(req,res,()=>{
                message="";
                res.redirect("/dashboard");
            });
        }
    });
});

app.get("/view", isLoggedIn ,(req,res)=>{
    User.findOne({username: req.user.username}, function(err, user){
        if(err)
            console.log(err);
        else{
            try{
                connection.query("SELECT *, datediff(last_update,planted_on) as days FROM stats INNER JOIN cropids  ON cropids.cropid = stats.cropid AND stats.uuid=+"+req.user.uid, function (err, result, fields) {
                   
                    var resultx = Object.values(JSON.parse(JSON.stringify(result)));
                    var harvest = 0;
                    var totalharvest = 0;
                    resultx.forEach(function(element) {
                        if(element.isharvested == 1){
                            harvest = harvest + 1;
                        }
                        totalharvest = totalharvest + 1;
                    });
                    var percentage = (harvest/totalharvest)*100;
                    res.render("view",{user:req.user.username , sensordata:resultx, userid:req.user.uid , percentage:percentage});
                  });
            
                }
                catch(e){
                    console.log(e);
                }   
        }
    });
})

app.post("/view", isLoggedIn ,(req,res)=>{
    User.findOne({username: req.user.username}, function(err, user){
        if(err)
            console.log(err);
        else{
            try{
                connection.query("Update cropids set isharvested=1 where cropid=+"+req.body.cropid, function (err, result, fields) {
                    res.redirect("/view");
                  });
            
                }
                catch(e){
                    console.log(e);
                }   
        }
    });
});



app.get("/notify",isLoggedIn, (req,res)=>{
    try{
        connection.query("SELECT * from notification where uuid="+req.user.uid, function (err, result, fields) {
           
            var resultx = Object.values(JSON.parse(JSON.stringify(result)));
            console.log(resultx);
            res.render("notify",{user:req.user.username , notification:resultx, userid:req.user.uid});
          });
    
        }
        catch(e){
            console.log(e);
        }   

});


app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.listen(port, () => {
    console.log('Server started on port 3000');
});