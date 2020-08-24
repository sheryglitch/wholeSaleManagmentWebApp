var express               = require("express"),
    router                = express.Router(),
    Company               = require("../models/company"),
	Shop                  = require("../models/company"),
	ItemC                 = require("../models/itemC"),
	ItemS                 = require("../models/itemS"),
	middleWare            = require("../middleware")


//Search Show Page
router.get("/",function(req,res){
          res.render("search/index");
});

//Search Logic And Display
router.post("/", function(req, res){
	if(req.body.search.type === 'sale'){
		ItemS.find({ saleDate: { $gte: req.body.search.from, $lte: req.body.search.to }},function(err,found){
			if(err)
			{
				res.render("search/sale");	
			}
			else{
				res.render("search/sale",{items:found});
			}
		});
	}
	else{
		ItemC.find({ perDate: { $gte: req.body.search.from, $lte: req.body.search.to }},function(err,found){
			if(err)
			{
				res.render("search/purchase");	
			}
			else{
				res.render("search/purchase",{items:found});
			}
		});
	}
});

module.exports = router;