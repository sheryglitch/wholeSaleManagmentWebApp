var express               = require("express"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	methodOverride 		  = require("method-override"),
	ItemC                 = require("./models/itemC"),
	Company               = require("./models/company"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
	middleWare            = require("./middleware")

//requiring routes
var companyRoutes    = require("./routes/companies"),
	shopRoutes		 = require("./routes/shops"),
	stockRoutes		 = require("./routes/stock"),
	searchRoutes	 = require("./routes/search"),
	bankRoutes		 =require("./routes/banks")

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/noman_wholesale', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Create By Sheharyar Ahmed For Noman Bhai",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//============
// ROUTES
//============

//Home Page Route
app.get('/',middleWare.isLoggedIn,function(req,res){
	res.render('home');
});

//Register Page Route
app.get("/register",middleWare.isLoggedIn, function(req, res){
   res.render("register"); 
});

//handling user sign up
app.post("/register",middleWare.isLoggedIn, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});

//login page route if not login
app.get('/login',middleWare.isLoggedInWhy,function(req,res){
	res.render('login');
});

//handling login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

//Logout Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.use("/banks", bankRoutes);
app.use("/stock", stockRoutes);
app.use("/shops", shopRoutes);
app.use("/companies", companyRoutes);
app.use("/search", searchRoutes);



//STOP EDITING HERE
app.listen(3000,function(){
	console.log("Running ...")
})