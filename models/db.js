const mongoose = require("mongoose");
const dbURL = require("../config.js").db;


mongoose.connect(dbURL,{useMongoClient:true})

const db = mongoose.connection;
db.on('error', function(err){
	console.log(err)
});
db.once('open', function() {
  console.log("db connect successfully!")
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
