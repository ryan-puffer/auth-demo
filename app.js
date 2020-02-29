var express                 = require('express'),
    mongoose                = require('mongoose');
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    User                    = require('./models/user')
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose');


mongoose.connect("mongodb://localhost/auth_demo_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var app = express();

app.use(require("express-session")({
    secret: "Redford is my son",
    resave: false,
    saveUninitialized: false
}))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=========================
//ROUTES
//=========================

app.set('view engine', 'ejs');
app.use(passport.initialize()); //need these two lines anytime use passport
app.use(passport.session());  //need these two lines anytime use passport

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.listen(3000, function(){
    console.log("Server has started!")
});