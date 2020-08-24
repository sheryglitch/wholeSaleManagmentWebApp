var express               = require("express"),
    router                = express.Router(),
    Bank                  = require("../models/bank"),
	middleWare            = require("../middleware")


//Banks Show Page
router.get("/",function(req,res){
	Bank.find({}, function(err, allBanks){
     if(err){
           console.log(err);
     } else {
          res.render("banks/index",{banks:allBanks});
      }
    });
});

//Create a new bank and add to database -- POST ROUTE
router.post("/",middleWare.isLoggedIn, function(req, res){
    // Create a new bank and save to DB
    Bank.create(req.body.bank, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/banks");
        }
    });
});


//NEW - show form to create new company
router.get("/new", middleWare.isLoggedIn, function(req, res){
   res.render("banks/new"); 
});

//Edit Bank Route
router.get("/:id/edit",middleWare.isLoggedIn, function(req, res){
    Bank.findById(req.params.id, function(err, foundBank){
        res.render("banks/edit", {bank: foundBank});
    });
});


//Update Bank
router.put("/:id",middleWare.isLoggedIn, function(req, res){
    // find and update the correct company
    Bank.findByIdAndUpdate(req.params.id,req.body.bank, function(err, updatedBank){
       if(err){
           res.redirect("/banks");
       } else {
           //redirect somewhere(show page)
           res.redirect("/banks");
       }
    });
});

//Delete Bank
router.delete("/:id",middleWare.isLoggedIn , function(req, res){
    //findByIdAndRemove
    Bank.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/banks");
       }
    });
});
module.exports = router;