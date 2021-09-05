![CodeQL](https://github.com/el-opcr/EricLonguemare_5_28032021/actions/workflows/codeql-analysis.yml/badge.svg)

## Setup and test :

- clone this repository

- install : npm install

- dev : npm run dev - then open browser at http://localhost:1234

- build : npm run build - build files are in dist/ folder - source files are in src/ folder

- scrape : npm run scrape - Use Puppeteer to scrape pages and lint - Add some teddies in cart to validate javascript generated HTML


## Remote API entry point :
https://polar-retreat-13131.herokuapp.com/api/teddies/

## Website preview :
https://el-opcr.github.io/EricLonguemare_5_28032021/dist/

## Javascript rendered HTML (Using Google Puppeteer) W3C Lint

* [index page](https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=https%3A%2F%2Fel-opcr.github.io%2FEricLonguemare_5_28032021%2Ftests%2Findex.html)
* [teddie page](https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=https%3A%2F%2Fel-opcr.github.io%2FEricLonguemare_5_28032021%2Ftests%2Fteddie.html)
* [cart page with Full HTML - Some Teddies in cart](https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=https%3A%2F%2Fel-opcr.github.io%2FEricLonguemare_5_28032021%2Ftests%2Fcart.html)

## W3C CSS3 Lint

* [index page](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fel-opcr.github.io%2FEricLonguemare_5_28032021%2Fdist%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=fr)
* [Teddie page](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fel-opcr.github.io%2FEricLonguemare_5_28032021%2Fdist%2Fteddy.html%3Fid%3D5beaa8bf1c9d440000a57d94&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=fr)
* [Cart page](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fel-opcr.github.io%2FEricLonguemare_5_28032021%2Fdist%2Fpanier.html%3Fpanier&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=fr)

see here for CSS errors : [Bootstrap 5 Validators](https://getbootstrap.com/docs/5.0/getting-started/browsers-devices/#validators)
 
## Google Lighthouse reports :
 
* [index page](https://googlechrome.github.io/lighthouse/viewer/?gist=11444c4ef812893fe9d83eef34e1745a)
* [Teddie page](https://googlechrome.github.io/lighthouse/viewer/?gist=8e2239966213282eb71f252da05f3b0a)
* [Cart page - With some teddies in cart](https://googlechrome.github.io/lighthouse/viewer/?gist=f795a8e915d31dffe9b676a32d55e942)


