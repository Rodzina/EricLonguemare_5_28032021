const puppeteer = require('puppeteer')

describe("Setup Testing",()=>{
  it("Home landing page",async()=>{
    const browser = await puppeteer.launch({headless:false})
    const context = await browser.createIncognitoBrowserContext();
    const page = await browser.newPage()
    await page.goto("http://localhost:1234");
    await page.waitForSelector('.card')
    await page.click('.card');
    //await page.close();
  });
});