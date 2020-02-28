module.exports = async function(res,formdata)
{
	var mysql = require('mysql');
	var conn = await require('./localconnection')();
	var formdata_keys = Object.keys(formdata);
	var sql = "select * from users where ";
	for(var i=0;i<formdata_keys.length;i++)
	{
		if(formdata[formdata_keys[i]] !== "")
		{
			sql += formdata_keys[i]+" like '%"+formdata[formdata_keys[i]]+"%' and ";
		}
		else
		{
			delete formdata[formdata_keys[i]];
		}
	}

	sql += " 1";

	if(Object.keys(formdata).length == 0)
	{
		formdata = 1;
	}
	conn.query(sql, function(err,results,fields)
	{
		if (err) throw err;
		res.render("userlist.html", {row:JSON.stringify([results, formdata])});    
	},res);
	conn.end();
}

