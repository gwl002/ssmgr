var sendMessage = require("./services/manager.js").send;



sendMessage({
	type: "add",
	port: 3966,
	ss_pass: "123456"
},"128.199.241.60",6000) ,