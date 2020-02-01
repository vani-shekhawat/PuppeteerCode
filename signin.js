module.exports = async function(page,url,email_field,email_submit,password_field,password_submit,email,password)
{

 await page.goto(url, {timeout:0});
 await page.waitForSelector(email_field);
 await page.type(email_field, email);
  console.log("email entered successfully");
  await page.waitForSelector(email_submit);
  await page.click(email_submit);
  console.log("email submit successfully");
  await page.waitForNavigation({timeout:0});
  await page.type(password_field, password );
  console.log(password_field);
  console.log("password enter successfully");
  // await page.waitForNavigation(0);
  await page.click(password_submit);
  console.log("password submit successfully");
}