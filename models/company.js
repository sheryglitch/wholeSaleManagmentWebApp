var mongoose = require("mongoose");

var companySchema = mongoose.Schema({
    name: String,
    bankAccount: Number,
	address: String,
	purchase: [
		 {
		 type: mongoose.Schema.Types.ObjectId,
         ref: "ItemC"
		 }
	]
});

module.exports = mongoose.model("Company", companySchema);