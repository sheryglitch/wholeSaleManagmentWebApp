var mongoose = require("mongoose");

var itemCSchema = mongoose.Schema({
    batch: String,
    name: String,
	itemPerCtn: Number,
	numCtn: Number,
	priceCtn: mongoose.Decimal128,
	priceItem: mongoose.Decimal128,
	perDate: Date 
});

module.exports = mongoose.model("ItemC", itemCSchema);