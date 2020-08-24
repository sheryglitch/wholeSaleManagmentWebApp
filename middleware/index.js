var middlewareObj = {};
//Middlewear for home
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Middlewear for login
 middlewareObj.isLoggedInWhy = function(req, res, next){
    if(!req.user){
        res.render('login');
    }
	else{
		res.redirect("/");
	}
}
 
 module.exports = middlewareObj;