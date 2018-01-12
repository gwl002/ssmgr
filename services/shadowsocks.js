var dgram = require("dgram");
var mongoose = require("mongoose");
var config = require("../config.js");

var dbURL = config.db;
var curServer = config.curServer;

var message = new Buffer("ping");
var socket = dgram.createSocket("udp4");
var flowSchema = mongoose.Schema({
        "port":String,
        "server":String,
        "flow":Number,
        "time":{type: Date, default: Date.now}
})
var Flow = mongoose.model("Flow",flowSchema);

mongoose.connect(dbURL,{useMongoClient:true},function(){
        console.log("connect to db successfully...");
})


socket.on("message",function(msg,rinfo){
        console.log(`recv msg from ${rinfo.address}`);
        var msg = `${msg}`;
        if(msg.startsWith('stat:')){
                var flowObj = msg.substr(6);
                var flows = JSON.parse(flowObj);
                console.log("flowObj",flowObj);
                for(var port in flows){
                        Flow.create({
                                port: port,
                                server: curServer,
                                flow: flows[port]
                        })
                }
        }
})

socket.send(message,0,message.length,8390,"localhost",function(err,bytes){
        console.log(bytes.toString())
})


const getIp = port => {
  const cmd = `netstat -ntu | grep ":${ port } " | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | grep -v 127.0.0.1 | uniq -d`;
  return new Promise((resolve, reject) => {
    exec(cmd, function(err, stdout, stderr){
      if(err) {
        reject(stderr);
      } else {
        const result = [];
        stdout.split('\n').filter(f => f).forEach(f => {
          if(result.indexOf(f) < 0) { result.push(f); }
        });
        resolve(result);
      }
    });
  });
};
