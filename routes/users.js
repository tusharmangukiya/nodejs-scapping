var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const { Client } = require('pg')

// db connection
const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'test_postgres',
  password: 'root',
  port: 5432,
})

/* GET users listing. */
router.get('/',async function(req, res, next) {

  client.connect(async function(err) {
    if (err) throw err;
    console.log("Connected!");
    const query = {
      text: `SELECT * FROM users WHERE email = '${req.query.email}'`,
      rowMode: 'array'
    };  
    var results =await client.query(query)
    if (results) {
      var users = results.rows[0]
      console.log("======users====== :: \n", users);
        const browser = await puppeteer.launch({     
          headless: false,
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1199, height: 900 });
        const link = 'https://www.linkedin.com/login';
        await page.goto(link);
        await page.click('form.login__form  input#username');
        await page.keyboard.type(users[0]);
        await page.click('form.login__form  input#password');
        await page.keyboard.type(users[1]);
        await page.keyboard.press('Enter');
    }
  });

  res.send('respond with a resource');
});

// (async () => {
//   const browser = await puppeteer.launch({
//       headless: false,
//       args: ['--proxy-server=127.0.0.1:24000']
//   });
//   const page = await browser.newPage();
//   await page.authenticate();
//   await page.goto('http://lumtest.com/myip.json');
//   await page.screenshot({path: 'example.png'});
//   await browser.close();
// })();


module.exports = router;



