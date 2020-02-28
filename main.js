var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var jwt= require('jsonwebtoken'); 	
(async()=>
{
	var urlencodedParser = bodyParser.urlencoded({extended : false});
	app.use(bodyParser.urlencoded({extended : true}));
	app.use(bodyParser.json());

	app.get('/createuser', function (req, res) 
	{
		res.sendFile( __dirname + "/" + "createuser.html" );
	})

	app.post('/createuser', urlencodedParser, async function(req,res)
	{	
		var createuser = await require('./createuser');
		await createuser(req,res);
	})
	
	app.get('/user/username', function(req,res)
	{
		res.sendFile(path.join(__dirname + '/userlogin.html'));
  	});

 	app.post('/user/username', async function(req,res)
  	{
		var authlogin= await require('./authlogin');
  		await authlogin(req,res);
	})

	app.use(function(req,res, next){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "*");
		next();
	})

	app.get('/jwt',async (req,res)=>
	{
		var token =  await require('./token');
		await token(req,res);
	})

	app.get('/auth', async function(req,res)
	{
		var authuser= await require('./AuthUser');
		await authuser(req,res);
	})
	app.get('/adobe', isAuthorized,async (req,res)=>
	{
		var vipdata = await require('./vipdata');
		await vipdata(req,res);
	})
	app.set('views', path.join(__dirname, '/'));
	app.engine('html', require('ejs').renderFile);
 	var userlist = await require('./userlist');
	app.get('/users', function (req, res) {

	   	formdata = req.query;
		userlist(res, formdata)
	})

	// app.post('/userlist', urlencodedParser, function (req, res)
	// {
	// 	formdata = req.body;
	// 	userlist(res, formdata)
	// })


	function isAuthorized(req,res,next)
	{
		if(typeof req.headers.authorization !== "undefined")
		{
			var token= req.headers.authorization.split(" ")[1];
			var privateKey = fs.readFileSync('./private.key', 'utf8');

			jwt.verify(token, privateKey,{algoritm: "HS256"},(err, decoded)=>
			{
				if(err){
					res.status(500).json({error: "Not Authorized"})
				}
				console.log(decoded);
				return next();
			})
		}
		else
		{
			res.status(500).json({error: "Not Authorized"})
		}
	}
})();
	
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})