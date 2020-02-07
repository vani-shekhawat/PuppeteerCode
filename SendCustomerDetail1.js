const express= require('express');
var app = express();
var fs = require('fs');
var jwt= require('jsonwebtoken');
var adobereseller = require('./adobereseller');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(function(req,res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
})

app.get('/adobe', isAuthorized,(req,res)=>
{
	console.log(req.query.vip);
	adobereseller(req.query.vip).then(function(vip_data)
	{
		res.send(vip_data);
	});

	

})

app.get('/jwt',(req,res)=>
{
	var privateKey = fs.readFileSync('./private.key', 'utf8');
	var token = jwt.sign({"body": "stuff"},privateKey,{algorithm:'HS256'});
	res.send(token);
})

function isAuthorized(req,res,next)
{
	if(typeof req.headers.authorization 
		!== "undefined")
	{
		var token= req.headers.authorization.split(" ")[1];
		var privateKey = fs.readFileSync('./private.key', 'utf8');

		jwt.verify(token, privateKey,{algoritm: "HS256"},(err, decoded)=>{
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
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
})