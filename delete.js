
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

//定义post请求的接口，比如要删除某个用户的信息
app.post('/delete', function(req, res){
	var name = req.body.name;
	//首先得从库里找到数据
	var delData = function(db, callback){
		//连接到数据文档
		var collection = db.collection('persons');
		//查询数据
		var whereStr = { "username": name };  //我们要删除的目标信息是所有包含这个内容的数据。
		
		collection.remove(whereStr, function(err, result){
			if(err){
				console.log('Error:' + err);
				return;
			}
			callback(result);
		});
	}
	
	MongoClient.connect(DB_CONN_STR, function(err, db){
		delData(db, function(result){
			//到这里数据库中对应的信息已经进行了修改
			res.status(200);
			res.json(result);
			db.close();
		});
	});
});

//配置服务器端口
var server = app.listen(3003, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log('删除服务启动http://localhost:', port);
});




