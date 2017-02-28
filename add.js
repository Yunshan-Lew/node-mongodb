
//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/foobar';

//配置node服务器相关内容：
var express = require('express');
var app = express();
var bodyParder = require('body-parser'); 
app.use(bodyParder.urlencoded({ extended: true }));

//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By", ' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
})

//定义post请求的接口
app.post('/add', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var data = [{ "username": username, "password": password }];
	
	//拿到数据后追加到数据库中
	var insertData = function(db, callback){
		//连接到数据文档
		var collection = db.collection('persons');
		collection.insert(data, function(err,result){
			if(err){
				console.log("Error: " + err);
				return;
			}
			callback(result);
		})
	}
	
	MongoClient.connect(DB_CONN_STR, function(err, db){
		insertData(db, function(result){
			res.status(200);
			res.json(result);
			db.close();
		});
	});
});

//配置服务器端口
var server = app.listen(3000, function(){
   var host = server.address().address;
   var port = server.address().port;
   console.log('增加服务启动http://localhost:', port);
});