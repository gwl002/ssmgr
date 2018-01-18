const net = require("net");
const host ="127.0.0.1";
const port = 9236;

const pack = (data)=>{
	let message= JSON.stringify(data);
	let dataBuffer = Buffer.from(message);
	let length = dataBuffer.length;
	let lengthBuffer = Buffer.from(("0000"+length.toString(16)).substr(-4),"hex");
	let pack = Buffer.concat([lengthBuffer,dataBuffer]);
	return pack;
}

const sendMessage = ()=>{
	let client = net.connect({port,host},()=>{
		client.write(pack({code:0,type:"add"}));
	})

	client.on("data", (data) =>{
		console.log("source 1234");
		let array = Array.from(data);
		for(let item in array){
			console.log(array[item])
		}
		client.end();
	})

	client.on("close",()=>{
		console.log("socket closed");
	})
}


setInterval(()=>{
	sendMessage();
},5000)