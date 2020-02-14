module.exports= async function(username,password)
{	
	var md5 = require('md5');
	var conn = await require('./localconnection')();
	var enc_password = md5(password);
	function sqlQuery(callback)
	{
		conn.query('SELECT * FROM users WHERE username=? AND password = ?',[username,enc_password], function(error,results,fields)
		{
			if(results.length > 0)
			{  
				callback(true);
			}
			else
			{
				callback(false);
			}
		})
	}

	return sqlQuery;
}