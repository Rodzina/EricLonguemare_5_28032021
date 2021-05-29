const fs = require('fs');
const puppeteer = require('puppeteer');

const url = process.argv[2] || 'https://el-opcr.github.io/EricLonguemare_5_28032021/dist/';
const path = process.argv[3] || `tests/index.html`;

(async function main() {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();

  await page.goto(url, { waitUntil: 'networkidle0' });
  fs.writeFileSync(path, await page.content());

  await browser.close();
})().catch(console.error);
