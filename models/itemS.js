var mongoose = require("mongoose");

var itemCSchema = mongoose.Schema({
    batch: String,
    name: String,
	numItem: Number,
	salePricePerItem: mongoose.Decimal128,
	salePriceTotal: mongoose.Decimal128,
	saleDate: Date 
});

module.exports = mongoose.model("ItemS", itemCSchema);