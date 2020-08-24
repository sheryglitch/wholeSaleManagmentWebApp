var mongoose = require("mongoose");

var shopSchema = mongoose.Schema({
    name: String,
	ownerName: String,
	ownerPhone: String,
	address: String,
	sale: [
		 {
		 type: mongoose.Schema.Types.ObjectId,
         ref: "ItemS"
		 }
	]
});

module.exports = mongoose.model("Shop", shopSchema);