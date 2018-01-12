const mongoose = require("mongoose");
const dbURL = require("./config.js").db;


mongoose.connect(dbURL,function(){
	console.log("connect mongodb successfully!")
})

mongoose.Promise = global.Promise;

module.exports = mongoose;
