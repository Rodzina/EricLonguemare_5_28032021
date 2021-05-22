import * as bootstrap from 'bootstrap'
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
// import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
// styles personnalisés
import { Teddy } from './classes/teddy' // Import our Teddy classes
import { Cart } from './classes/cart' // Import our Cart classes
import { displayAndStorePicture, fetchFromAPI, getUrl, setPreselectedItem, stringify, parse, updateColorsObject } from './helpers/common' // Import helpers

/**
 * build html for one teddie card on home page
 * @param teddy {{colors: array.<string>, _id: string, name: string, description: string, imageUrl: string, price: number}}
 */
const displayTeddyCard = async teddy => {
  const myHtmlContent = document.getElementById('content')
  const myCard = document.createElement('a')
  const className = ['card', 'card-width-350', 'm-2']
  myCard.classList.add(...className)
  myCard.href = getUrl().url + 'teddy.html' + '?' + 'id=' + teddy._id
  myCard.addEventListener('click', function () {
  })
  myHtmlContent.appendChild(myCard)
  const myCardPicture = document.createElement('img')
  myCardPicture.crossOrigin = 'anonymous'
  myCardPicture.setAttribute('width', '380px')
  myCardPicture.setAttribute('height', '250px')

  await displayAndStorePicture(myCardPicture, teddy.imageUrl, 'w=380&h=380&height=250&f=webp&crop=cover', '+small')
    .catch(err => console.log(err))

  myCardPicture.alt = teddy.name
  myCard.appendChild(myCardPicture)
  myCardPicture.classList.add('card-img-top')
  const myCardTitle = document.createElement('h2')
  myCard.appendChild(myCardTitle)
  const myCardTitleClasses = ['card-title-font', 'pt-4']
  myCardTitle.classList.add(...myCardTitleClasses)
  const myCardTitleText = document.createTextNode(teddy.name)
  myCardTitle.appendChild(myCardTitleText)
}

/**
 *
 * @param response
 * @returns {Promise<void>}
 */
const displayHome = async response => {
  await response.json()
    .then(datas => {
      for (const row of datas) {
        const myTeddy = new Teddy(row.colors, row._id, row.name, row.description, row.imageUrl, row.price)
        displayTeddyCard(myTeddy)
        myTeddy.store() // put item in local storage.
      }
    })
}

/**
 *
 * @param teddy
 * @param theCart
 * @returns {Promise<void>}
 */
const displayTeddyPage = async function (teddy, theCart) {
  document.title += ' | ' + teddy.name
  document.head.children.namedItem('keywords').content += ', ' + teddy.name
  document.head.children.namedItem('description').content += ' ' + teddy.name + '.'
  const teddyH1 = document.getElementById('teddyname')
  teddyH1.innerText = teddy.name
  teddyH1.classList.add('text-highlighted')

  const htmlContent = document.getElementById('content')

  const teddyPicture = document.createElement('img')
  teddyPicture.crossOrigin = 'anonymous'

  await displayAndStorePicture(teddyPicture, teddy.imageUrl, 'f=webp', '+big')
    .catch(err => console.log(err))
  teddyPicture.alt = teddy.name
  teddyPicture.classList.add('card-img-top')
  htmlContent.appendChild(teddyPicture)

  const teddyInfosDiv = document.createElement('div')
  teddyInfosDiv.classList.add('card-body')
  htmlContent.appendChild(teddyInfosDiv)

  const teddyDescription = document.createElement('div')
  teddyInfosDiv.appendChild(teddyDescription)
  const teddyDescriptionText = document.createTextNode(teddy.description)
  teddyDescription.appendChild(teddyDescriptionText)

  const teddyPriceContainer = document.createElement('div')
  teddyInfosDiv.appendChild(teddyPriceContainer)
  teddyPriceContainer.classList.add('price-container')

  const teddyPrice = document.createElement('div')
  teddyPriceContainer.appendChild(teddyPrice)
  teddyPrice.classList.add('price')

  const teddyPriceLabel = document.createElement('span')
  teddyPrice.appendChild(teddyPriceLabel)
  teddyPriceLabel.classList.add('label')

  const teddyPriceLabelTextOne = document.createTextNode('Achète moi !')
  teddyPriceLabel.appendChild(teddyPriceLabelTextOne)

  const teddyPriceTextValue = document.createElement('span')
  teddyPrice.appendChild(teddyPriceTextValue)
  teddyPriceTextValue.classList.add('number')

  const teddyPriceValue = document.createTextNode(new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(teddy.price / 100).replace('€', 'Br')) // Brouzouf
  teddyPriceTextValue.appendChild(teddyPriceValue)

  const teddyPriceLabelTwo = document.createElement('span')
  teddyPrice.appendChild(teddyPriceLabelTwo)
  teddyPriceLabelTwo.classList.add('label')

  const teddyPriceLabelTextTwo = document.createTextNode('Maintenant Stp ;)')
  teddyPriceLabelTwo.appendChild(teddyPriceLabelTextTwo)

  // Option selection display

  const teddyColorsOptions = document.createElement('form')
  teddyColorsOptions.classList.add('btn-group')
  teddyColorsOptions.setAttribute('role', 'group')
  teddyColorsOptions.setAttribute('name', 'colorform')
  htmlContent.appendChild(teddyColorsOptions)

  for (let i = 0, max = teddy.colors.length; i < max; i++) {
    const option = teddy.colors[i]
    const input = document.createElement('input')
    input.type = 'radio'
    input.name = 'btnradio'
    input.setAttribute('id', 'btnradio' + (i + 1))
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('value', option)
    input.classList.add('btn-check')
    teddyColorsOptions.appendChild(input)
    const optionLabel = document.createElement('label')
    const optionLabelClasses = ['btn', 'btn-outline-primary']
    optionLabel.classList.add(...optionLabelClasses)
    optionLabel.setAttribute('for', 'btnradio' + (i + 1))
    const optionLabelDescription = document.createTextNode(option)
    optionLabel.appendChild(optionLabelDescription)
    teddyColorsOptions.appendChild(optionLabel)
  }

  // Add to cart display and actions
  const toCart = document.createElement('button')
  const toCardClassList = ['btn', 'btn-block', 'btn-outline-success', 'disabled']
  toCart.classList.add(...toCardClassList)
  toCart.setAttribute('type', 'button')
  toCart.setAttribute('id', 'addToCart')
  const toCardText = document.createTextNode('Ajouter au panier')
  // handle add to cart button
  toCart.onclick = function () {
    console.log('Button cart pressed')
    const preselectedStorage = localStorage.getItem('preselected')
    if (!preselectedStorage) {
      console.error('No preselected item')
      return
    }

    try {
      const preselected = parse(preselectedStorage)

      const length = theCart.items.length
      let isFound = false

      if (length > 0) {
        for (let i = 0, max = length; i < max; i++) {
          const itemToCheck = parse(theCart.items[i])
          if (itemToCheck.id === preselected.id) {
            console.log('Update quantity for teddy already in cart')
            console.log('Objet colors 1:')
            console.log(itemToCheck.colors)
            itemToCheck.colors = updateColorsObject(itemToCheck.colors, preselected.color)
            itemToCheck.qty += 1
            theCart.items.splice(i, 1)
            theCart.items.push(stringify(itemToCheck))
            isFound = true
            break
          }
        }
        if (!isFound) {
          console.log('This product is not in cart')
          theCart.items.push(stringify(preselected))
        }
      } else {
        console.log('Initialize cart in localstorage and push first item')
        theCart.items.push(stringify(preselected))
      }
      theCart.totalNumber += 1
      theCart.totalAmount += preselected.unitPrice
      localStorage.setItem('cart', stringify(theCart))
      // item has been added to cart - back to color selection
      document.getElementById('addToCart').classList.replace('active', 'disabled')
      localStorage.removeItem('preselected')
    } catch (e) {
      console.error(e)
    }
  }

  toCart.appendChild(toCardText)
  htmlContent.appendChild(toCart)

  // option selection logic
  const btnRadios = document.forms.colorform.elements.btnradio
  console.log(btnRadios)

  // remove selected option on page start (or reload)
  if (localStorage.getItem('preselected')) {
    localStorage.removeItem('preselected')
  }

  // handle selection event
  // https://stackoverflow.com/questions/63975754/can-i-have-a-radio-button-group-with-only-one-radio-button-and-have-it-still-fu
  if (btnRadios.length === undefined) {
    // item  has only one option so check it and add it to preselected item
    const forceCheckedRadio = document.getElementById('btnradio1')
    forceCheckedRadio.setAttribute('checked', '')
    // setPreselectedItem
    forceCheckedRadio.onclick = async (event) => {
      await setPreselectedItem(teddy, event.target.value)
    }
  } else {
    for (let i = 0, max = btnRadios.length; i < max; i++) {
      // Group of options so wait user choice then check it and add it to preselected item
      btnRadios[i].onclick = async (event) => {
        await setPreselectedItem(teddy, event.target.value)
      }
    }
  }
}

/**
 *
 * @param theCart
 */
const displayCartPage = async theCart => {
  const htmlContent = document.getElementById('content')
  const myBlockQuote = document.createElement('blockquote')
  const myCartContent = document.createElement('div')
  myBlockQuote.innerText = 'Article(s) : ' + theCart.totalNumber + ' - ' + 'Montant total : ' + theCart.totalAmount / 100

  // https://www.javascripttutorial.net/javascript-array-sort/
  // https://stackoverflow.com/questions/6129952/javascript-sort-array-by-two-fields

  const myArray = []

  for (let i = 0, max = theCart.items.length; i < max; i++) {
    myArray.push(parse(theCart.items[i]))
  }

  myArray.sort(function (x, y) {
    const a = x.name.toUpperCase()
    const b = y.name.toUpperCase()
    return a === b ? 0 : a > b ? 1 : -1
  })

  console.log(myArray)

  console.log(theCart)
  const length = theCart.items.length
  console.log(length)

  for (let i = 0, max = length; i < max; i++) {
    const itemToDisplay = parse(theCart.items[i])
    const myCartProductDiv = document.createElement('div')
    const myClass = ['card', 'd-flex']
    const myUl = document.createElement('ul')
    myCartProductDiv.classList.add(...myClass)
    myCartProductDiv.appendChild(myUl)
    const teddyPictureElement = document.createElement('img')
    teddyPictureElement.crossOrigin = 'anonymous'
    teddyPictureElement.setAttribute('width', '190px')
    teddyPictureElement.setAttribute('height', '125px')
    await displayAndStorePicture(teddyPictureElement, itemToDisplay.imageUrl, 'w=190&h=190&height=125&f=webp&crop=cover', '+thumb')
      .catch(err => console.log(err))
    myUl.appendChild(teddyPictureElement)
    const myLi = document.createElement('li')
    myUl.appendChild(myLi)
    myLi.innerText = 'id :' + itemToDisplay.id
    const myLi2 = document.createElement('li')
    myUl.appendChild(myLi2)
    myLi2.innerText = itemToDisplay.name
    const myLi3 = document.createElement('li')
    myUl.appendChild(myLi3)
    myLi3.innerText = itemToDisplay.color
    const myLi5 = document.createElement('li')
    myUl.appendChild(myLi5)
    myLi5.innerText = '-  ' + itemToDisplay.qty + '  +'
    const myLi6 = document.createElement('li')
    myUl.appendChild(myLi6)
    myLi6.innerText = (itemToDisplay.unitPrice / 100).toString()
    const myLi7 = document.createElement('li')
    myUl.appendChild(myLi7)
    myLi7.innerText = ((itemToDisplay.unitPrice / 100) * itemToDisplay.qty).toString()
    myCartContent.appendChild(myCartProductDiv)
  }
  htmlContent.appendChild(myBlockQuote)
  htmlContent.appendChild(myCartContent)
}

/**
 *
 * @returns {Promise<void>}
 */
const process = async () => {
  // cart init
  let theCart
  if (localStorage.getItem('cart') === null) {
    console.log('No Cart, init it')
    theCart = new Cart(0, 0)
  } else {
    try {
      console.log('One cart exist, get it')
      theCart = parse(localStorage.getItem('cart'))
    } catch (e) {
      console.log('Error : Cant get cart' + e)
    }
  }
  const homeURL = document.getElementById('homepage')
  homeURL.href = getUrl().baseurl
  const cartURL = document.getElementById('cartpage')
  cartURL.href = getUrl().baseurl.replace(/\/$/, '') + '/panier.html?panier'
  const entryPoint = 'https://polar-retreat-13131.herokuapp.com/api/teddies/'
  const params = new URLSearchParams(location.search)

  if (!params.has('id') && !params.has('panier')) {
    fetchFromAPI(entryPoint)
      .then(response => displayHome(response))
  }

  if (params.has('panier')) {
    // do something
    await displayCartPage(theCart)
  }

  if (params.has('id')) {
    const id = params.get('id')
    let teddy
    if (id in localStorage) {
      teddy = await Teddy.createFromJSON(localStorage.getItem(id))
    } else {
      const teddyInfo = await fetchFromAPI(entryPoint + id)
        .then(response => response.json())
        .then(value => stringify(value))
      teddy = await Teddy.createFromJSON(teddyInfo)
    }
    await teddy.store()
    await displayTeddyPage(teddy, theCart)
  }
}

process()
  .catch(err => console.log(err))

// Check boostrap availability

if (typeof bootstrap !== 'undefined' || bootstrap !== null) {
  console.log('Alert version : ' + bootstrap.Alert.VERSION)
  console.log('Button version : ' + bootstrap.Button.VERSION)
  console.log('Popover version : ' + bootstrap.Popover.VERSION)
  console.log('Tooltip version : ' + bootstrap.Tooltip.VERSION)
  window.bootstrap = bootstrap
} else {
  console.log('index.js : Bootstrap non défini')
}
