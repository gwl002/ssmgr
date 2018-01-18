const net = require("net");
const config = require("../config.js");
const crypto = require('crypto');

const tcpPort = config.tcpPort;
const packPassword = config.packPassword;


const pack = (data,password) =>{
	const message = JSON.stringify(data);
	const now = Date.now();
	const timeBuffer = Buffer.from('0'+ now.toString(16),'hex');
	const dataBuffer = Buffer.from(message);
	const length = dataBuffer.length + 4 + 6;
	const lengthBuffer = Buffer.from(('0000' + length.toString(16)).substr(-4),'hex');
	const code = crypto.createHash("md5").update(now + message + password).digest('hex').substr(0,8);
	const codeBuffer = Buffer.from(code, 'hex');
	const pack = Buffer.concat([lengthBuffer,timeBuffer,dataBuffer,codeBuffer]);
	return pack;
}

const receiveData = async (receive, data) => {
  receive.data = Buffer.concat([receive.data, data]);
  return checkData(receive);
};

const checkData = async (receive) => {
  const buffer = receive.data;
  let length = 0;
  let data;
  if (buffer.length < 2) {
    return;
  }
  length = buffer[0] * 256 + buffer[1];
  if (buffer.length >= length + 2) {
    data = buffer.slice(2, length + 2);
    const message = JSON.parse(data.toString());
    return message;
  } else {
    return;
  }
};

const sendMessage = (data,host,port) =>{
	let options = {host,port};
	let promise = new Promise((resolve,reject) =>{
		let client = net.connect(options,()=>{
			client.write(pack(data,packPassword))
		});

		client.setTimeout(10*1000); //10秒超时
		let receive = {
			data: Buffer.from(""),
			socket: client
		};

		client.on('data', data=>{
			receiveData(receive,data).then(message =>{
				console.log("manager receive mesage:",message);
				if(!message){

				}else if(message.code == 0){
					resolve(message.data);
				}else{
					reject();
				}
				client.end();
			}).catch( err =>{
				console.log(err);
				client.end();
			})
		});

		client.on("close",()=>{
			console.log("client closed")
		});

		client.on("error",err =>{
			console.log(err);
		});

		client.on("timeout",()=>{
			console.log("timeout");
			client.end();
		})
	});

	return promise;
}

exports.send = sendMessage;