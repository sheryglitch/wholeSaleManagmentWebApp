var mongoose = require("mongoose");

var bankSchema = mongoose.Schema({
    name: String,
    account: String,
	title: String,
});

module.exports = mongoose.model("Bank", bankSchema);