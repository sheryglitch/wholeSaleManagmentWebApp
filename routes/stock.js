var express               = require("express"),
    router                = express.Router(),
    Shop                  = require("../models/shop"),
	middleWare            = require("../middleware"),
	ItemS                 = require("../models/itemS"),
	ItemC                 = require("../models/itemC")

var found = [];
var founds = [];
var totalItemsC = 0;
var totalItemsS = 0;
var batchc = 0;
var batchs = 0;
var itemName = 0;
var s = 0;
var sl = 0;
var numberOfItemsCompany = [];
var numberOfItemsShop = [];
router.get("/",function(req,res){
		numberOfItemsShop = [];
		numberOfItemsCompany = [];
		ItemC.find({},'batch',function(err, allItemC){
		allItemC.forEach(function(item){
			found.push(item.batch);
			found = getUnique(found);
		})
		console.log(found);
		found.forEach(function(f){
			ItemC.find({'batch':f},function(err, allItemC){
				allItemC.forEach(function(t){
				totalItemsC += t.numCtn * t.itemPerCtn;
				batchc = t.batch;
				itemName = t.name;
				});
				//console.log('Batch Company : '+ batchc + ' Total Count Company : ' + totalItemsC);
				numberOfItemsCompany.push({'batch': batchc,'total':totalItemsC,'name':itemName}); 
				totalItemsC = 0;
		    });
			ItemS.find({'batch':f},function(err, allItemS){
				if(err){
					
				}
				else{
				totalItemsS = 0;
				batchs = 0;
				allItemS.forEach(function(ts){
				totalItemsS += ts.numItem;
				batchs = ts.batch;
				});
				//console.log('Batch Shop : '+ batchs+' Total Count Shop : ' + totalItemsS);
				if(batchs!==0)
					{
				numberOfItemsShop.push({'batch': batchs,'total':totalItemsS}); 
						}
				}
		    });
		found = [];
     });
			setTimeout(function() {
			let numberOfItemsLeft = [];
			numberOfItemsCompany.forEach(function(ic){
				console.log("Array C Batch : " + ic.batch);
			    console.log("Array C Total : " + ic.total);
				try{
				numberOfItemsLeft.push({'batch':ic.batch,'left':ic.total - numberOfItemsShop.find(obj => obj.batch == ic.batch).total,'name':ic.name,'purchased':ic.total,'sold':numberOfItemsShop.find(obj => obj.batch == ic.batch).total});
				}catch(err){				                numberOfItemsLeft.push({'batch':ic.batch,'left':ic.total,'name':ic.name,'purchased':ic.total,'sold':0});
			};

			});
				
			numberOfItemsShop.forEach(function(is){
				console.log("Array S Batch : " + is.batch);
			    console.log("Array S Total : " + is.total);
			});
				console.log("Array S Total : " + numberOfItemsShop);
			numberOfItemsLeft.forEach(function(is){
				console.log("Left Batch : " + is.batch);
				console.log("Left Name : " + is.name);
			    console.log("Left Total : " + is.left);
			});
			res.render('stock',{items:numberOfItemsLeft});
			}, 100);
			
  });
});

function getUnique(array){
        var uniqueArray = [];
        
        // Loop through array values
        for(i=0; i < array.length; i++){
            if(uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }

module.exports = router;