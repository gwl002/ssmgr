const dgram = require("dgram");
const config = require("../config.js");
const exec = require("child_process").exec;

const client = dgram.createSocket('udp4');
const cron = require("../utils/cron.js");

//数据库模型 flow
const models = require("../models");
const Account = models.accountModel;
const Flow = models.flowModel;

const udpPort = config.udpPort;
const udpHost = "127.0.0.1";

let existPort = [];
let existPortUpdatedAt = Date.now();
const setExistPort = flow => {
  existPort = [];
  for(const f in flow) {
    existPort.push(+f);
  }
  existPortUpdatedAt = Date.now();
};

const getServerIp = () =>{
	let cmd = `netstat -ntu | grep ESTABLISHED | awk '{print $4}' | cut -d: -f1| grep -v 127.0.0.1 | uniq -d`
	return new Promise((resolve,reject) =>{
		exec(cmd,function(err,stdout,stderr){
			if(err){
				reject(stderr)
			}else{
				let result = [];
				stdout.split('\n').filter(f => f).forEach(f => {
				  if(result.indexOf(f) < 0) { result.push(f); }
				});
				resolve(result);
			}
		})
	})
}

const getClientIp = port => {
	let cmd = `netstat -ntu | grep ":${ port } " | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1| grep -v 127.0.0.1 | uniq -d`
	return new Promise((resolve,reject)=> {
		exec(cmd,function(err,stdout,stderr){
			if(err){
				reject(stderr)
			}else{
				let result = [];
				stdout.split('\n').filter(f => f).forEach(f => {
				  if(result.indexOf(f) < 0) { result.push(f); }
				});
				resolve(result);
			}
		})
	})
}

const sendPing = () =>{
	client.send(new Buffer('ping'), udpPort, udpHost);
	return Promise.resolve('ok');
}

const sendMessage = (message) =>{
	client.send(message, udpPort, udpHost);
	return Promise.resolve('ok');
}

const removePort = (port) =>{
	return sendMessage(`remove: {"server_port": ${ port }}`);
}

const addPort = (port,ss_pass) =>{
	return sendMessage(`add: {"server_port": ${ port }, "password": "${ ss_pass }"}`)
}

const changePassword = async(port,ss_pass) =>{
	await removePort(port);
	await addPort(port,ss_pass);
	console.log(`change password for ${port},new password for shadow is ${ss_pass}`);
}

const connect = async() =>{
	let curServer = await getServerIp()[0];
	client.on("message",function(msg,rinfo){
	        console.log(`recv msg from ${rinfo.address}`);
	        var msg = `${msg}`;
	        if(msg.startsWith('stat:')){
	                var flowObj = msg.substr(6);
	                var flows = JSON.parse(flowObj);

	                setExistPort(flows);
	                console.log("flowObj",flowObj);
	                for(let port in flows){
	                        Flow.create({
	                                port: port,
	                                server: curServer,
	                                flow: flows[port]
	                        })
	                }
	        }
	})

	client.on("error",function(err){
		console.log("client error:",error)
	})

	client.on("close",function(err){
		console.log("client closed")
	})
}

const resend = async () => {
  if(Date.now() - existPortUpdatedAt >= 180 * 1000) {
    existPort = [];
  }
  const accounts = await Account.find({});
  accounts.forEach(f => {
    if(existPort.indexOf(f.port) < 0) {
      addPort(f.port,f.ss_pass);
    }
  });
};

const startup = async() =>{
	console.log("start up ...")
	sendPing();
	removePort(8388);
	console.log("delete default port")
	let accounts  = await Account.find({});
	console.log("accounts in db");
	for(let account of accounts){
		addPort(account.port,account.ss_pass)
	}
}

connect();
startup();
cron.minute(() => {
  resend();
  sendPing();
}, 1);

module.exports={
	getClientIp,
	getServerIp,
	removePort,
	addPort,
	changePassword
}