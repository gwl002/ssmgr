# ss-manager
manager of ss server


# mongodb version3 auth step:
1.vi /etc/mongod.conf
	注释掉 bind，所有ip来源都可以链接，或者填写ip白名单 
	更改 port 为 指定port,如 28018
2.systemctl restart mongod
3.mongo --port 28018
```
	use admin
	db.createUser(
	  {
	    user: "admin",
	    pwd: "admin123",
	    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
	  }
	)
```
4. vi /etc/mongod.conf 
	2.6一下
		auth=true 开启db验证

	3.2 
		authorization: enabled
5. systemctl restart mongod
6. mongo --port 28018 -u "admin" -p "admin123" --authenticationDatabase "admin" 
```
	use ss
	db.createUser(
	  {
	    user: "gwl002",
	    pwd: "admin123",
	    roles: [ { role: "readWrite", db: "ss" }]
	  }
	)
```
7. use ss
	db.auth("gwl002","admin123")
	show collections 不提示未授权就说明成功添加用户了

# shadowsocks 多端口配置
link:https://github.com/shadowsocks/shadowsocks/wiki/Manage-Multiple-Users
python版本开启命令： 
```
	sserver --manager-address 127.0.0.1:6001 -c tests/server-multi-passwd.json
```

# sshd配置
	service sshd restart 重启
	/etc/ssh/sshd_config 更改配置文件
	复制公钥到~/.ssh/authorized_keys

