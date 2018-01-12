var mongoose = require("./db.js");
var accountSchema = mongoose.Schema({
	"user":String,
	"port":Number,
	"passwd":String,
	"email":String,
	"ss_pass":String
});

var accountModel = mongoose.model("Account",accountSchema);

module.exports = accountModel;
