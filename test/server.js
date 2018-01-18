const net = require("net");

const socketList = [];
const closeSocketList = [];
const port = 9236;
const host = "127.0.0.1";

const server = net.createServer(socket =>{
	socketList.push(socket);

	socket.on("data", data=>{
		console.log(data);
		socket.end(Buffer.from("1234"))
	})

	socket.on("end", ()=>{
		console.log("socket ended")
	})

	socket.on("close", ()=>{
		console.log("socket closed")
		socketList.shift();
		closeSocketList.push(socket);
	})

})

server.listen({
  port,
  host,
}, () => {
  console.log(`server listen on ${ host }:${ port }`);
});

setInterval(()=>{
	console.log("socketList",socketList.length);
	console.log("closeSocketList",closeSocketList.length);
},2000);