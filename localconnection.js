var mysql = require('mysql');
module.exports = async function connectDB() {
		// console.log("jj");
    var con = mysql.createConnection({
        // host: "64.225.40.235",
        host:"localhost",
        user: "root",
        password: "",
        database: "dbemp"
    });
 
    	return con;
    
}