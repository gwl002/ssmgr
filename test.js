var models =require("./models");

var account = models.accountModel;


var accountPrint = async()=>{
	accounts = await account.find({});
	console.log(accounts);
}

accountPrint();