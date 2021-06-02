const fs = require('fs')
const puppeteer = require('puppeteer')

// https://stackoverflow.com/questions/51789038/set-localstorage-items-before-page-loads-in-puppeteer

const myUrlsLocal = [
  ['http://localhost:1234', 'tests/index.html'],
  ['http://localhost:1234/teddy.html?id=5beaa8bf1c9d440000a57d94', 'tests/teddie.html'],
  ['http://localhost:1234/panier.html?panier', 'tests/cart.html']
]

const myUrlsGithub = [
  ['https://el-opcr.github.io/EricLonguemare_5_28032021/dist/', 'tests/index.html'],
  ['https://el-opcr.github.io/EricLonguemare_5_28032021/dist/teddy.html?id=5beaa8bf1c9d440000a57d94', 'tests/teddie.html'],
  ['https://el-opcr.github.io/EricLonguemare_5_28032021/dist/panier.html?panier', 'tests/cart.html']
]

// {\"id\":\"5beaacd41c9d440000a57d97\",\"colors\":{\"Beige\":1,\"Tan\":0,\"Chocolate\":0},\"color\":\"Tan\",\"qty\":1,\"unitPrice\":5500,\"name\":\"Garfunkel\",\"imageUrl\":\"http://polar-retreat-13131.herokuapp.com/images/teddy_5.jpg\"}"

const getPage = async myUrls => {
  // scrape Pages for W3C validation
  for (let myUrl of myUrlsGithub) {
    const browser = await puppeteer.launch({headless:false})
    const [page] = await browser.pages()
    // console.log(myUrl)
    console.log(myUrl[0])
    console.log(myUrl[1])

    await page.goto(myUrl[0], { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      //localStorage.clear()
      const theTestCart = '{"totalNumber":2,"totalAmount":8400,"items":["{\\"id\\":\\"5beaa8bf1c9d440000a57d94\\",\\"colors\\":{\\"Pale brown\\":1,\\"Dark brown\\":0,\\"White\\":0},\\"color\\":\\"Pale brown\\",\\"qty\\":1,\\"unitPrice\\":3900,\\"name\\":\\"Arnold\\",\\"imageUrl\\":\\"http://polar-retreat-13131.herokuapp.com/images/teddy_2.jpg\\"}","{\\"id\\":\\"5beaabe91c9d440000a57d96\\",\\"colors\\":{\\"Brown\\":1,\\"Blue\\":0,\\"Pink\\":0},\\"color\\":\\"Brown\\",\\"qty\\":1,\\"unitPrice\\":4500,\\"name\\":\\"Gustav\\",\\"imageUrl\\":\\"http://polar-retreat-13131.herokuapp.com/images/teddy_4.jpg\\"}"]}'
      //console.log(theTestCart)
      //console.log(JSON.stringify(theTestCart).toString())
      localStorage.setItem('cart', theTestCart)
    })
    await page.goto(myUrl[0], { waitUntil: 'networkidle0' })
    fs.writeFileSync(myUrl[1], await page.content())
    //await browser.close()
  }
}

// choose url Array
getPage(myUrlsGithub).catch(console.error)