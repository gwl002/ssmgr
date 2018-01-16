var mongoose = require("./db.js");
var accountSchema = mongoose.Schema({
	"user":String,
	"port":Number,
	"passwd":String,
	"email":String,
	"ss_pass":String,
	"status":{
		type: Number,
		default: 1
	}
});

var accountModel = mongoose.model("Account",accountSchema);

module.exports = accountModel;
