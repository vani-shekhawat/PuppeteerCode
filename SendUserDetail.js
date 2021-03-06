var md5 = require('md5'); 
var phone1= require('phone');
var validator = require('email-validator');
var passwordValidator = require('password-validator');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
(async()=>{
	var urlencodedParser = bodyParser.urlencoded({ extended: false })
	var conn = await require('./localconnection')();
	app.get('/userform.html', function (req, res) 
		{
			res.sendFile( __dirname + "/" + "userform.html" );
		})
	app.post('/user', urlencodedParser, async function(req,res)
	{
		var Name = req.body.name;
   		var UserName = req.body.username;
   		var valid_email= await isEmailValidated(UserName);
   		if(!valid_email)
   		{
   			res.send("User Name is not valid");
   			process.exit();
   		}
   		
		var Phone = req.body.phone;
		var valid_phone = await isPhoneValidated(Phone);
		if(!valid_phone)
		{
			res.send("Phone Number is not valid");
			process.exit();
		}
		var Password = req.body.password; 
		var valid_password = await isPasswordValidated(Password);
		if(!valid_password)
		{
			res.send("Password is not valid");
			process.exit();
		}
		var enc_password = md5(Password);
		var data= 
		{
			Name:Name,UserName:UserName,Phone:Phone, Password:enc_password
		};
		conn.query('INSERT INTO users SET ?', data, function (error, results, fields) {

			if (error) throw error;
			res.send('All data inserted successfully');
		});
	});
	var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
	})
})();
async function isEmailValidated(UserName)
{
	var ret_email=validator.validate(UserName);
	return ret_email;
}

async function isPhoneValidated(Phone)
{
	var ret_phone= phone1(Phone, 'IND');

	if(ret_phone.length>0)
	{
		return true;
	}
	else{
		return false;
	}
	return ret_phone;
}
async function isPasswordValidated(Password)
{
	var len_password = new passwordValidator();
	len_password
	.is().min(8)
	.is().max(12)
	.has().uppercase()
	.has().digits()
	.has().not().spaces();
	var check_pass=len_password.validate(Password);
	// console.log(check_pass);
	return check_pass;
}