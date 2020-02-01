module.exports= async function(file_path,file_name)
{
	var dir= require ('node-dir');
	const delay = require('delay');
	const replaceAll = require('replaceall');

	var files = [];

	
	do
	{
		await delay(4000);
		await dir.paths(file_path+'/', function(err, paths) {
		  if (err) throw err;
		  files = paths.files;
		});
		console.log(files);
	}while(files.length == 0);
}