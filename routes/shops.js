var express               = require("express"),
    router                = express.Router(),
    Shop               = require("../models/shop"),
	middleWare            = require("../middleware"),
	ItemS                 = require("../models/itemS")

//Shop Show Page
router.get("/",middleWare.isLoggedIn,function(req,res){
	Shop.find({}, function(err, allShops){
     if(err){
           console.log(err);
     } else {
          res.render("shops",{shops:allShops});
      }
    });
});

//NEW - show form to create new shop
router.get("/new", middleWare.isLoggedIn, function(req, res){
   res.render("newshop"); 
});

//Create a new shop and add to database -- POST ROUTE
router.post("/",middleWare.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array`
    // Create a new campground and save to DB
    Shop.create(req.body.shop, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/shops");
        }
    });
});

//Edit Shop Route
router.get("/:id/edit", middleWare.isLoggedIn , function(req, res){
    Shop.findById(req.params.id, function(err, foundShop){
        res.render("editshop", {shop: foundShop});
    });
});


//Update Shop
router.put("/:id",middleWare.isLoggedIn, function(req, res){
    // find and update the correct shop
    Shop.findByIdAndUpdate(req.params.id,req.body.shop, function(err, updatedShop){
       if(err){
           res.redirect("/shops");
       } else {
           //redirect somewhere(show page)
           res.redirect("/shops");
       }
    });
});

//Delete Shop
router.delete("/:id",middleWare.isLoggedIn, function(req, res){
   Shop.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/shops");
      } else {
          res.redirect("/shops");
      }
   });
});


//Sell To Shop
router.get("/:id/sale",middleWare.isLoggedIn,function(req,res){
	Shop.findById(req.params.id, function(err, foundShop){
        res.render("sale", {shop: foundShop});
    });
});

//Add Sale
router.post("/:id/sale",middleWare.isLoggedIn,function(req, res){
   //lookup company using ID
   Shop.findById(req.params.id, function(err, Shop){
       if(err){
           console.log(err);
           res.redirect("/shops");
       } else {
		   ItemS.create(req.body.item, function(err, itemF){
           if(err){
               console.log(err);
           } else {
		   itemF.salePriceTotal = req.body.item.numItem * req.body.item.salePricePerItem;
           //save item
           itemF.save();
		   //push item to company
		   Shop.sale.push(itemF);
		   Shop.save();
		   console.log(itemF);
		   res.redirect("/shops");
          }
        });
       }
   });
});

//Sale Details
router.get("/:id/sale/details",middleWare.isLoggedIn,function(req,res){
	Shop.findOne({ _id: req.params.id }).populate('sale').exec(function(err,foundShop){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("saledetails", {shop: foundShop});
        }
    });
});

// ITEMS EDIT ROUTE
router.get("/:id/sale/:item_id/edit", middleWare.isLoggedIn, function(req, res){
   ItemS.findById(req.params.item_id, function(err, foundItem){
      if(err){
          res.redirect("back");
      } else {
        res.render("edititems", {shop_id: req.params.id, item: foundItem});
      }
   });
});


//UPDATE ITEMS
router.put("/:id/sale/:item_id", middleWare.isLoggedIn, function(req, res){
   ItemS.findByIdAndUpdate(req.params.item_id, req.body.item, function(err, updatedItem){
      if(err){
          res.redirect("back");
      } else {
		   updatedItem.salePriceTotal = req.body.item.numItem * req.body.item.salePricePerItem;
           updatedItem.save();
           res.redirect("/shops/" + req.params.id + "/sale/details");
      }
   });
});

//Delete Item
router.delete("/:id/sale/:itemS_id",middleWare.isLoggedIn , function(req, res){
    //findByIdAndRemove
    ItemS.findByIdAndRemove(req.params.itemS_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/shops/" + req.params.id + "/sale/details");
       }
    });
});

module.exports = router;