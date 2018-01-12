const dgram = require("dgram");
const mongoose = require("mongoose");
const config = require("../config.js");


let dbURL = config.db;

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

const showIps = async (port) => {
	const serverIp = await getServerIp();
	const clientIps = await getClientIp();
	console.log("serverIp:",serverIp);
	console.log("clientIp:",clientIps);
}

showIps();


module.exports={
	getClientIp,
	getServerIp
}