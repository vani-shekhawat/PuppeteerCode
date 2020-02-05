var call = require('./CallApi');
(async ()=>{
	
	host = 'https://aisplestore.com/api/v1';
	endpoint = '/authenticate';
	formData= {email:'kkumar@aisplstore.com',password:'kaushal@987'};
  	identifier_key = "token";
	var data=await call(url=host+endpoint,formData, identifier_key)
	console.log(data);

})();