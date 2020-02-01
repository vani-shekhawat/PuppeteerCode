const puppeteer = require('puppeteer');
var sign = require('./signin.js');
var csvj = require('./csvjson.js');
var empty = require('./EmptyDir');
var existence= require('./CheckFileExistence');
module.exports= async function(vip)
{
	const browser = await puppeteer.launch({
		headless:false,
		args:[`--window-size-675,720`]
	});
	const page = await browser.newPage();

	var url= 'http://reseller.adobe.com/';
	var auth_url= 'https://auth.services.adobe.com/en_US/index.html?callback=https%3A%2F%2Fims-na1.adobelogin.com%2Fims%2Fadobeid%2FResellerConsole%2FAdobeID%2Ftoken%3Fredirect_uri%3Dhttps%253A%252F%252Freseller.adobe.com%252Fredirect.html%253Ftarget%253D%25252F%2523from_ims%253Dtrue%2526old_hash%253D%2526api%253Dauthorize&client_id=ResellerConsole&scope=AdobeID%2Copenid%2Cread_countries_regions%2Cread_organizations&denied_callback=https%3A%2F%2Fims-na1.adobelogin.com%2Fims%2Fdenied%2FResellerConsole%3Fredirect_uri%3Dhttps%253A%252F%252Freseller.adobe.com%252Fredirect.html%253Ftarget%253D%25252F%2523from_ims%253Dtrue%2526old_hash%253D%2526api%253Dauthorize%26response_type%3Dtoken&relay=bb9f0d7c-650f-40c5-a490-fe1befbf2444&locale=en_US&flow_type=token&idp_flow_type=login#/';

	var email_field= '#EmailPage-EmailField';
	var email_submit= '.spectrum-Button-label';
	var password_field = '#PasswordPage-PasswordField';
	var password_submit= '.spectrum-Button-label'; 
	var email = 'licensing@aisplglobal.com';
	var password = 'License$135';
	await sign(page,auth_url,email_field,email_submit,password_field,password_submit,email,password);


	// var vip = 'F6C825F7DF001007EEAA';

	await page.waitForSelector('.dashboard-nav-item');
	await page.goto(url+'/customers/all');
	console.log('all customer page open');

	search_button ='.icon-search';
	search_field='.search-input';
	customer_click = '.data-list-action';
	var customer_detail_identifier= '.details-admin-info';
	await search(page,search_button,search_field,vip,customer_click, customer_detail_identifier);
  
  
	var path = 'E:\\vani\\downloadfile';
	var download_file = '.icon-download';
	var file_name = 'customer-details.csv';
	await download(page,path,download_file, file_name);

	var ret_json= await csvj(path, file_name);
	console.log(ret_json);
  
};

async function search(page,search_button,search_field,vip,customer_click, customer_detail_identifier)
{
	await page.waitForSelector(search_button)
	await page.click(search_button);
	console.log(search_button)
	console.log("search button open successfully");
	await page.waitForSelector(search_field);
	await page.type(search_field, vip);
	await page.keyboard.press(String.fromCharCode(13));
	console.log("customer search successfully");
	await page.waitFor(2000);
	await page.click(customer_click);
	console.log("customer click successfully");
	await page.waitForSelector(customer_detail_identifier);
}
async function download(page,path,download_file,file_name)
{
	await page.waitFor(2000);
	await page._client.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:path});
	await empty(path);

	console.log("page behaviour set");
	await page.click(download_file);
	await existence(path,file_name);
	console.log("file download");
}