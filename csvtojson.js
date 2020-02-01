var csv = require('csvtojson');
module.exports= async function(path, file_name)
{
	
	var csvobj =await csv(
	{
		output:"csv",
		noheader:true,
		trim: true,
		delimeter:",",
		ignoreEmpty:true,
	})
 	.fromFile(path +'\\'+ file_name);

 	return csvobj;
 
}