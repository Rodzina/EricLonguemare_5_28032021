const fs = require('fs')
const puppeteer = require('puppeteer')

// https://stackoverflow.com/questions/51789038/set-localstorage-items-before-page-loads-in-puppeteer

const myUrls = [
  ['https://el-opcr.github.io/EricLonguemare_5_28032021/dist/', 'tests/index.html'],
  ['https://el-opcr.github.io/EricLonguemare_5_28032021/dist/teddy.html?id=5beaa8bf1c9d440000a57d94', 'tests/teddie.html'],
  ['https://el-opcr.github.io/EricLonguemare_5_28032021/dist/panier.html?panier', 'tests/cart.html']
]

const theCart = []

const getPage = async myUrls => {
  // scrape Pages for W3C validation
  for (let myUrl of myUrls) {
    const browser = await puppeteer.launch()
    const [page] = await browser.pages()
    console.log(myUrl)
    console.log(myUrl[0])
    console.log(myUrl[1])
    await page.goto(myUrl[0], { waitUntil: 'networkidle0' })
    fs.writeFileSync(myUrl[1], await page.content())
    await browser.close()
  }
}

getPage(myUrls).catch(console.error)