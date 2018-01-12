var mongoose = require("mongoose");

var flowSchema = mongoose.Schema({
	"port":Number,
	"server":String,
	"flow":Number,
	"time":{type: Date, default: Date.now}
});

var flowModel = mongoose.model("Flow",flowSchema);

module.exports = flowModel;