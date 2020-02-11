var md5 = require('md5');
(async ()=>{ 
	var conn =await require('./localconnection.js')();	
	conn.connect(function(err)
	{
		if(err) throw err;
		console.log("Connected!");
		var sql = insertData();
		conn.query(sql, function (err,result){
			if(err) throw err;
			console.log(result);

		});
	}); 
})();


function createTable()
{
	var table = "CREATE TABLE `users` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,`name` varchar(255) NOT NULL,`username` varchar(225) NOT NULL UNIQUE,`phone` varchar(15) DEFAULT NULL,`password` varchar(225) NOT NULL,`is_deleted` tinyint(1) NOT NULL DEFAULT '0',`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  PRIMARY KEY(id))";
	return table;
}


function insertData()
{
	var insert_user = "INSERT INTO users (name,username,phone,password) VALUES ('Shiv','shiv@gmail.com','98978444', '"+md5('s123') +"'),('garg','garg@gmail.com','98988867','"+md5('g456')+"'),('yug','yug@gmail.com','89766543', '"+md5('y125')+"')";
	console.log(insert_user);
	return insert_user;
}