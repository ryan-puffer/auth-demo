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
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
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

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            })
        }
    })
})

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login");
})

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){

})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("login");
}

app.listen(3000, function(){
    console.log("Server has started!")
});