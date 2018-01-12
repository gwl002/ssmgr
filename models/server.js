var mongoose = require("./db.js");
var serverSchema = mongoose.Schema({
	"ip":String,
	"brand":String,
	"location":String,
});

var serverModel = mongoose.model("Server",serverSchema);

module.exports = serverModel;