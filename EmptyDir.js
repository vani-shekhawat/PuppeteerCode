module.exports = async function(path)
{
    var fs = require("fs");
	fs.readdir(path,(err,files)=>
	{
		if(err) throw err;
		for(var file of files)
		{
			fs.unlink(path +'\\'+ file, err=>
		  	{
		  		if(err) throw err;
		  	});
		}
	})

}