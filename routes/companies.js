var express               = require("express"),
    router                = express.Router(),
    Company               = require("../models/company"),
	middleWare            = require("../middleware"),
	ItemC                 = require("../models/itemC")


//Companies Show Page
router.get("/",middleWare.isLoggedIn,function(req,res){
	Company.find({}, function(err, allCompanies){
     if(err){
           console.log(err);
     } else {
          res.render("companies",{companies:allCompanies});
      }
    });
});

//Create a new company and add to database -- POST ROUTE
router.post("/",middleWare.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var bankAccount = req.body.bank;
    var address = req.body.address;
    var newCompany = {name: name, bankAccount: bankAccount, address: address}
    // Create a new campground and save to DB
    Company.create(newCompany, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/companies");
        }
    });
});


//NEW - show form to create new company
router.get("/new", middleWare.isLoggedIn, function(req, res){
   res.render("newcompany"); 
});

//Edit Company Route
router.get("/:id/edit",middleWare.isLoggedIn, function(req, res){
    Company.findById(req.params.id, function(err, foundCompany){
        res.render("editcompany", {company: foundCompany});
    });
});


//Update Company
router.put("/:id",middleWare.isLoggedIn, function(req, res){
    // find and update the correct company
    Company.findByIdAndUpdate(req.params.id,req.body.company, function(err, updatedCompany){
       if(err){
           res.redirect("/companies");
       } else {
           //redirect somewhere(show page)
           res.redirect("/companies");
       }
    });
});

//Delete Comapany
router.delete("/:id",middleWare.isLoggedIn, function(req, res){
   Company.findById(req.params.id).populate('purchase').exec(function(err,foundCompany){
      if(err){
          res.redirect("/companies");
      } else {
		      foundCompany.purchase.forEach((purchase) => {
		      ItemC.findByIdAndRemove(purchase._id, function(err){
       			if(err){
           			res.redirect("back");
       			} else {
					console.log('Item Deleted');
       			}		
   			  });
			 });
		  setTimeout(()=>{
			 res.redirect("/companies");
		  },100);
		  foundCompany.remove();
      }
   });
});


//Purchase From Comapany
router.get("/:id/purchase",middleWare.isLoggedIn,function(req,res){
	Company.findById(req.params.id, function(err, foundCompany){
        res.render("purchase", {company: foundCompany});
    });
})

//Add Purchase
router.post("/:id/purchase",middleWare.isLoggedIn,function(req, res){
   //lookup company using ID
   Company.findById(req.params.id, function(err, Company){
       if(err){
           console.log(err);
           res.redirect("/companies");
       } else {
		   ItemC.create(req.body.item, function(err, itemF){
           if(err){
               console.log(err);
           } else {
		   itemF.priceItem = req.body.item.priceCtn /req.body.item.itemPerCtn;
           //save item
           itemF.save();
		   //push item to company
		   Company.purchase.push(itemF);
		   Company.save();
		   console.log(itemF);
		   res.redirect("/companies");
          }
        });
       }
   });
});

//Purchase Details
router.get("/:id/purchase/details",middleWare.isLoggedIn,function(req,res){
	Company.findOne({ _id: req.params.id }).populate('purchase').exec(function(err,foundCompany){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("purchasedetails", {company: foundCompany});
        }
    });
});

// ITEMC EDIT ROUTE
router.get("/:id/purchase/:item_id/edit", middleWare.isLoggedIn, function(req, res){
   ItemC.findById(req.params.item_id, function(err, foundItem){
      if(err){
          res.redirect("back");
      } else {
        res.render("edititem", {company_id: req.params.id, item: foundItem});
      }
   });
});


//UPDATE ITEMC
router.put("/:id/purchase/:item_id", middleWare.isLoggedIn, function(req, res){
   ItemC.findByIdAndUpdate(req.params.item_id, req.body.item, function(err, updatedItem){
      if(err){
          res.redirect("back");
      } else {
			updatedItem.priceItem = req.body.item.priceCtn /req.body.item.itemPerCtn;
           updatedItem.save();
          res.redirect("/companies/" + req.params.id + "/purchase/details");
      }
   });
});

//Delete Item
router.delete("/:id/purchase/:itemC_id",middleWare.isLoggedIn , function(req, res){
    //findByIdAndRemove
    ItemC.findByIdAndRemove(req.params.itemC_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/companies/" + req.params.id + "/purchase/details");
       }
    });
});

module.exports = router;