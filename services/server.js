const net = require("net");
const crypto = require('crypto');
const config = require("../config.js");
const shadowsocks = require("./shadowsocks.js");

const tcpPort = config.tcpPort;
const packPassword = config.packPassword;
const host = "0.0.0.0";

const handleReceive = (receive,data) =>{
	receive.data = Buffer.concat([receive.data,data]);
	checkData(receive);
}

const checkCode = (data,password,code) =>{
	let time = Number.parseInt(data.slice(0,6).toString('hex'),16);
	if(Math.abs(Date.now()-time) >10*60*1000){
		return false;
	}
	let command = data.slice(6).toString();
	let md5 = crypto.createHash("md5").update(time + command + password).digest('hex');
	return md5.substr(0,8) == code.toString('hex');
}

const handleCommand = async(data,code) =>{
	try{
		let command = JSON.parse(data.slice(6).toString());
		let port;
		let ss_pass;
		console.log("------ receive command:",command);
		switch(command.type){
			case "add":
				port = +command.port;
				ss_pass = command.ss_pass;
				return shadowsocks.addPort(port,ss_pass);
			case "remove":
				port = +command.port;
				return shadowsocks.removePort(port);
			case "pwd":
				port = +command.port;
				ss_pass = command.ss_pass;
				return shadowsocks.changePassword(port,ss_pass);
			default:
				return Promise.reject("unknown command");
		}

	}catch(err){
		throw err;
	}
}

const pack = (data)=>{
	let message= JSON.stringify(data);
	let dataBuffer = Buffer.from(message);
	let length = dataBuffer.length;
	let lengthBuffer = Buffer.from(("0000"+length.toString(16)).substr(-4),"hex");
	let pack = Buffer.concat([lengthBuffer,dataBuffer]);
	return pack;
}

const checkData = (receive) =>{
	let buffer = receive.data;
	let length =0;
	let data;
	let code;
	if(buffer.length <2){
		receive.socket.end();
		return;
	}
	length = buffer[0]*256 + buffer[1];
	console.log("------- receive buffer:",buffer);
	if(buffer.length >= length + 2){
		data = buffer.slice(2,length-2);
		code = buffer.slice(length-2);
		if(!checkCode(data,packPassword,code)){
			receive.socket.end();
			return;
		}
		handleCommand(data).then(s => {
			receive.socket.end(pack({code:0,data:s}))
		},e=>{
			console.log("handleCommand error:",e);
			receive.socket.end(pack({code:1}))
		});
	}
}

const server = net.createServer(socket =>{
	let receieve = {
		data: Buffer.from(""),
		socket
	}

	socket.on("data",data =>{
		handleReceive(receieve,data);
	});

	socket.on("end",() =>{
		console.log("tcp socket ended")
	});

	socket.on("close",() =>{
		console.log("tcp socket closed")
	});
}).on("error",(err)=>{
	console.log("tcp socket error:",err);
})

server.listen({
  port:tcpPort,
  host,
}, () => {
  console.log(`server listen on ${ host }:${ tcpPort }`);
});