import * as bootstrap from 'bootstrap'
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
// import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
// styles personnalisés

// import "./assets/scss/custom.scss";//with {preload: true}; //{preload: true}); // Import our scss file
import { Teddy } from './classes/teddy' // Import our Teddy classes
import { Client } from './classes/client' // Import our Teddy classes

class Cart {
  constructor () {
    this.items = []
  }
}

/**
 *
 * @returns {{baseurl: string, url: URL}}
 */
const getUrl = () => {
  const url = new URL(location.href)
  const hostname = url.hostname
  const pathname = url.pathname
  const protocol = url.protocol
  const port = url.port
  let baseUrl = protocol + '//' + hostname
  if (hostname === 'localhost') {
    baseUrl += ':' + port
  } else {
    const segments = pathname.split('/')
    for (let index = 0; index < segments.length - 1; ++index) {
      baseUrl += segments[index] + '/'
    }
  }
  return {
    baseurl: baseUrl,
    url: url
  }
}

/**
 * async fetch of API url for JSON response
 * @param entryPoint
 * @returns {Promise<Response>}
 */
const fetchFromAPI = async entryPoint => await fetch(entryPoint)
  .catch(err => console.log(err))

/**
 *
 * @param element
 * @param teddy
 * @param params
 * @param suffix
 * @returns {Promise<void>}
 */
const displayAndStoreTeddyPicture = async (element, teddy, params, suffix) => {
  if (localStorage.getItem(teddy.imageUrl + suffix) === null) {
    element.addEventListener('load', function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = element.width
      canvas.height = element.height
      ctx.drawImage(element, 0, 0, element.width, element.height)
      try {
        localStorage.setItem(teddy.imageUrl + suffix, JSON.stringify(canvas.toDataURL('image/webp')))
      } catch (e) {
        console.log('Storage failed: ' + e)
      }
    }, false)
    element.src = teddy.imageUrl.replace(/^http:\/\//i, 'https://') + '?' + params
  } else {
    element.src = JSON.parse(localStorage.getItem(teddy.imageUrl + suffix))
  }
}

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
    sessionStorage.setItem('_id', teddy._id)
  })
  myHtmlContent.appendChild(myCard)
  const myCardPicture = document.createElement('img')
  myCardPicture.crossOrigin = 'anonymous'
  myCardPicture.setAttribute('width', '380px')
  myCardPicture.setAttribute('height', '250px')

  await displayAndStoreTeddyPicture(myCardPicture, teddy, 'w=380&h=380&height=250&f=webp&&crop=cover', '+small')
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
async function displayTeddyPage (teddy, theCart) {
  document.title += ' | ' + teddy.name
  document.head.children.namedItem('keywords').content += ', ' + teddy.name
  document.head.children.namedItem('description').content += ' ' + teddy.name + '.'
  const teddyH1 = document.getElementById('teddyname')
  teddyH1.innerText = teddy.name
  teddyH1.classList.add('text-highlighted')

  const htmlContent = document.getElementById('content')

  const teddyPicture = document.createElement('img')
  teddyPicture.crossOrigin = 'anonymous'
  // teddyPicture.setAttribute("width", "380px");
  // teddyPicture.setAttribute("height", "250px");

  await displayAndStoreTeddyPicture(teddyPicture, teddy, 'f=webp', '+big')
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
  teddyColorsOptions.setAttribute('name', 'clrform')
  htmlContent.appendChild(teddyColorsOptions)

  for (let i = 0; i < teddy.colors.length; i++) {
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

  // Add to cart display
  const toCart = document.createElement('button')
  const toCardClassList = ['btn', 'btn-block', 'btn-outline-success', 'disabled']
  toCart.classList.add(...toCardClassList)
  toCart.setAttribute('type', 'button')
  toCart.setAttribute('id', 'addToCart')
  const toCardText = document.createTextNode('Ajouter au panier')
  toCart.onclick = function () {
    console.log('Button cart pressed')
    const preselected = localStorage.getItem('preselected')
    console.log(preselected)

    theCart.items.push(preselected)
    localStorage.setItem('cart', JSON.stringify(theCart))
    localStorage.removeItem('preselected')
    console.log(theCart)
  }
  toCart.appendChild(toCardText)
  htmlContent.appendChild(toCart)

  // option selection logic
  // debug
  const btnRadios = document.forms.clrform.elements.btnradio
  console.log(btnRadios)

  // remove selected option on page start (or reload)
  if (localStorage.getItem('preselected')) {
    localStorage.removeItem('preselected')
  }

  // handle selection event
  // https://stackoverflow.com/questions/63975754/can-i-have-a-radio-button-group-with-only-one-radio-button-and-have-it-still-fu
  if (btnRadios.length === undefined) {
    // only one option so check it and add it to preselected item
    console.log('Only one radio button')
    const forceCheckedRadio = document.getElementById('btnradio1')
    forceCheckedRadio.setAttribute('checked', '')
    const preselectedTeddyColor = { id: teddy._id, color: teddy.colors[0], qty: 1 }
    console.log(preselectedTeddyColor)
    localStorage.setItem('preselected', JSON.stringify(preselectedTeddyColor))
    // allow add to cart button
    document.getElementById('addToCart').classList.replace('disabled', 'active')
  } else {
    for (let i = 0, max = btnRadios.length; i < max; i++) {
      // Group of options so wait user choice then check it and add it to preselected item
      btnRadios[i].onclick = function () {
        console.log('Clicked Value : ' + this.value)
        console.log('teddyId :' + teddy._id)
        const preselectedTeddyColor = { id: teddy._id, color: this.value, qty: 1 }
        console.log(preselectedTeddyColor)
        localStorage.setItem('preselected', JSON.stringify(preselectedTeddyColor))
        // allow add to cart button
        document.getElementById('addToCart').classList.replace('disabled', 'active')
      }
    }
  }
}

/**
 *
 * @returns {Promise<void>}
 */
const process = async () => {
  // cart init
  let theCart
  if (localStorage.getItem('cart') === null) {
    theCart = new Cart()
  } else {
    theCart = localStorage.getItem('cart')
  }
  const homeURL = document.getElementById('homepage')
  homeURL.href = getUrl().baseurl
  const entryPoint = 'https://polar-retreat-13131.herokuapp.com/api/teddies/'
  const params = new URLSearchParams(location.search)
  if (!params.has('id')) {
    fetchFromAPI(entryPoint)
      .then(response => displayHome(response))
  } else {
    const id = params.get('id')
    let teddy
    if (id in localStorage) {
      teddy = await Teddy.createFromJSON(localStorage.getItem(id))
    } else {
      const teddyInfo = await fetchFromAPI(entryPoint + id)
        .then(response => response.json())
        .then(value => JSON.stringify(value))
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
