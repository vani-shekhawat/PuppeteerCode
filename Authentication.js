const express= require('express');
var app = express();
var fs = require('fs');
var jwt= require('jsonwebtoken');
var path = require('path');
var bodyParser = require('body-parser');
var user_authenticate = require('./UserAuthentication');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(function(req,res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
})
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get('/jwt',async (req,res)=>
{
	var username = req.query.username;
    var password = req.query.password;
  	var authentication =  await user_authenticate(username,password);
  	authentication(function(is_authenticated)
  	{
        if(is_authenticated)
        {
			var privateKey = fs.readFileSync('./private.key', 'utf8');
			var token = jwt.sign({"body": "stuff"},privateKey,{algorithm:'HS256'});
			res.send(token);
        }
        else
        {
          res.send("Yor are not authorized user");
        }
        res.end();
  	});
})

  app.get('/auth', async function(req,res)
  {
      var username = req.query.username;
      var password = req.query.password;
      var authentication = await user_authenticate(username,password);
      authentication(function(is_authenticated)
      {
        if(is_authenticated==true)
        {
          res.send("Yor are  authorized user"); 
        }
        else
        {
          res.send("Yor are not authorized user");
        }
        res.end();
      });
  });


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