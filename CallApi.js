
module.exports= async function(url,formdata,id_key)
{
  var delay = require('delay');
  var request = require('request');

 headers = {
      'Content-Type': 'application/json'
    };
  var options = {
    url:    url,
    method: 'POST',
    headers: headers,
    formData: formdata
  };

  var data;
  await request(options, function(err, res) {
    if(err)
    {
      throw err;
    }
    data= JSON.parse(res.body);
  });

  do
  {
    await delay(1000);
  }while(!data.hasOwnProperty(id_key));

  return data;
  
}