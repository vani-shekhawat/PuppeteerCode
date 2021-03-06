const express= require('express');
var app = express();
var fs = require('fs');
var jwt= require('jsonwebtoken');
var adobereseller = require('./adobereseller');
var bodyParser = require('body-parser');
var call = require('./CallApi')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(function(req,res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
})

app.get('/adobe', isAuthorized,(req,res)=>
{
	console.log(req.query.vip);
	adobereseller(req.query.vip).then(async function(vip_data)
	{
		var ret_data = await dataFormat(vip_data);
		res.send(ret_data);
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

async function dataFormat(data)
{
	var host = 'https://abhay.aisplestore.com/api/v1';
	var token= await authentication(host);
	var ret_data= await getData(host,token, data);
	return ret_data;
}

async function authentication(host)
{
	endpoint = '/authenticate';
	formData= {email:'akhil@aisplglobal.com',password:'akhil@987'};
  	identifier_key = "token";
	var data=await call(url=host+endpoint,formData, identifier_key);
	if(data.hasOwnProperty(identifier_key))
	{
		return data.token;
	}
	else
	{
		throw data.error;
	}
}
async function getData(host,token, data)
{
	var endpoint=`/getformatcsvdatatojson?token=${token}`;
	formData= {data:data};
	identifier_key = "personal_detail";
	var data_res=await call(url=host+endpoint,formData,identifier_key);
	if(data_res.hasOwnProperty(identifier_key))
	{
		return data_res;
	}
	else
	{
		throw data_res.error;
	}
}