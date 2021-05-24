import * as bootstrap from 'bootstrap'
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
// import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
// styles personnalisés
import { Teddy } from './classes/teddy' // Import our Teddy classes
import { Cart } from './classes/cart' // Import our Cart classes
import {
  displayAndStorePicture,
  fetchFromAPI,
  getUrl,
  setPreselectedItem,
  stringify,
  parse,
  updateColorsQty,
  updateGeneralQuantityAnPriceDisplayed,
  updateTeddyQuantityToDisplayForColor,
  sortingTheCartTeddiesArray
} from './helpers/common' // Import helpers

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

  const teddyPriceLabelTextTwo = document.createTextNode('Choisis ma couleur ;)')
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
            itemToCheck.colors = updateColorsQty(itemToCheck.colors, preselected.color)
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
      updateGeneralQuantityAnPriceDisplayed(theCart, ['itemnumber'])
      theCart.items = sortingTheCartTeddiesArray(theCart.items)
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

  // sort theCart.items on teddy name to preserve order of items in cart
  theCart.items = sortingTheCartTeddiesArray(theCart.items)

  const length = theCart.items.length

  for (let i = 0, max = length; i < max; i++) {
    const itemToDisplay = parse(theCart.items[i])
    const myCartProductDiv = document.createElement('div')
    const myClass = ['card', 'd-flex']
    myCartProductDiv.classList.add(...myClass)
    myCartProductDiv.setAttribute('id', itemToDisplay.id + 'card')
    const teddyPictureElement = document.createElement('img')
    teddyPictureElement.classList.add('card-img-top')
    teddyPictureElement.crossOrigin = 'anonymous'
    teddyPictureElement.setAttribute('width', '190px')
    teddyPictureElement.setAttribute('height', '125px')
    teddyPictureElement.setAttribute('alt', itemToDisplay.name)
    await displayAndStorePicture(teddyPictureElement, itemToDisplay.imageUrl, 'w=190&h=190&height=125&f=webp&crop=cover', '+thumb')
      .catch(err => console.log(err))
    myCartProductDiv.appendChild(teddyPictureElement)
    const myLi = document.createElement('div')
    myCartProductDiv.appendChild(myLi)
    myLi.innerText = 'id :' + itemToDisplay.id
    const myLi2 = document.createElement('h2')
    myLi2.classList.add('card-title-font')
    myCartProductDiv.appendChild(myLi2)
    myLi2.innerText = itemToDisplay.name
    // create column for each color from colors - detail
    const myDetail = document.createElement('div')
    const myDetailClasses = ['d-flex', 'flex-row', 'justify-content-evenly', 'flex-wrap']
    myDetail.classList.add(...myDetailClasses)
    myCartProductDiv.appendChild(myDetail)
    for (const [key, value] of Object.entries(itemToDisplay.colors)) {
      const myDetailColumn = document.createElement('div')
      myDetailColumn.classList.add('justify-content-center')
      const myLi31 = document.createElement('div')
      myDetailColumn.appendChild(myLi31)
      myLi31.innerText = key
      const myLi32 = document.createElement('div')
      const myMinusButton = document.createElement('button')
      myMinusButton.setAttribute('type', 'button')
      myMinusButton.setAttribute('autocomplete', 'off')
      myMinusButton.setAttribute('value', key.toString())
      const myMinusButtonIcon = document.createElement('i')
      myMinusButtonIcon.classList.add('bi', 'bi-dash-circle-fill')
      myMinusButtonIcon.setAttribute('aria-label', 'Enlever un ' + itemToDisplay.name + ' de couleur ' + key.toString())
      myMinusButton.appendChild(myMinusButtonIcon)
      myMinusButton.onclick = function () {
        console.log('Button minus Clicked')
        console.log(itemToDisplay.id)
        for (let z = 0, max = theCart.items.length; z < max; z++) {
          console.log(theCart.items.length)
          const itemToCheck = parse(theCart.items[z])
          console.log(itemToCheck.id)
          if (itemToDisplay.id === itemToCheck.id) {
            console.log('Minus : itemToDisplay = itemtockeck')
            const myDisplayedQuantityToModify = itemToDisplay.id + key.toString().replace(' ', '').toUpperCase()
            if (document.getElementById(myDisplayedQuantityToModify).innerText.toString() === '0') {
              break
            }
            console.log('Update quantity for teddy already in cart')
            console.log('Objet colors :' + key.toString())
            itemToDisplay.colors = updateColorsQty(itemToDisplay.colors, key.toString(), true)
            itemToDisplay.qty -= 1
            updateTeddyQuantityToDisplayForColor(key.toString(), itemToDisplay.colors, myDisplayedQuantityToModify)
            theCart.items.splice(z, 1)
            console.log('splice : ' + z)
            if (itemToDisplay.qty > 0) {
              console.log('push quantity :' + itemToDisplay.qty)
              theCart.items.push(stringify(itemToDisplay))
              console.log('push')
            }
            if (itemToDisplay.qty >= 0) {
              theCart.totalNumber -= 1
              theCart.totalAmount -= itemToDisplay.unitPrice
              updateGeneralQuantityAnPriceDisplayed(theCart)
            }
            if (itemToDisplay.qty === 0) {
              console.log('to remove : ' + itemToDisplay.id + 'card')
              document.getElementById(itemToDisplay.id + 'card').outerHTML = ''
            }
            break
          }
        }
        theCart.items = sortingTheCartTeddiesArray(theCart.items)
        localStorage.setItem('cart', stringify(theCart))
        // theCart = parse(localStorage.getItem('cart'))
      }
      const myQtySpan = document.createElement('span')
      myQtySpan.setAttribute('id', itemToDisplay.id + key.toString().replace(' ', '').toUpperCase())
      myQtySpan.innerText = value.toString()
      const myPlusButton = document.createElement('button')
      myPlusButton.setAttribute('type', 'button')
      myPlusButton.setAttribute('autocomplete', 'off')
      myPlusButton.setAttribute('value', key.toString())
      const myPlusButtonIcon = document.createElement('i')
      myPlusButtonIcon.classList.add('bi', 'bi-plus-circle-fill')
      myPlusButtonIcon.setAttribute('aria-label', 'Ajouter un ' + itemToDisplay.name + ' de couleur ' + key.toString())
      myPlusButton.appendChild(myPlusButtonIcon)
      myPlusButton.onclick = function () {
        console.log('Button plus Clicked')
        console.log(itemToDisplay.id)
        for (let z = 0, max = theCart.items.length; z < max; z++) {
          const itemToCheck = parse(theCart.items[z])
          console.log(itemToCheck.id)
          if (itemToDisplay.id === itemToCheck.id) {
            console.log('Plus : itemToDisplay = itemtockeck')
            const myDisplayedQuantityToModify = itemToDisplay.id + key.toString().replace(' ', '').toUpperCase()
            console.log('Update quantity for teddy already in cart')
            console.log('Objet colors :' + key.toString())
            itemToDisplay.colors = updateColorsQty(itemToDisplay.colors, key.toString(), false)
            itemToDisplay.qty += 1
            console.log(itemToDisplay.id + key.toString().replace(' ', '').toUpperCase())
            console.log(itemToDisplay.qty)
            updateTeddyQuantityToDisplayForColor(key.toString(), itemToDisplay.colors, myDisplayedQuantityToModify)
            theCart.items.splice(z, 1)
            theCart.items.push(stringify(itemToDisplay))
            // sorted to avoid errors when update cart
            theCart.totalNumber += 1
            theCart.totalAmount += itemToDisplay.unitPrice
            updateGeneralQuantityAnPriceDisplayed(theCart)
            break
          }
        }
        theCart.items = sortingTheCartTeddiesArray(theCart.items)
        console.log(theCart)
        localStorage.setItem('cart', stringify(theCart))
        // theCart = parse(localStorage.getItem('cart'))
      }
      myLi32.appendChild(myMinusButton)
      myLi32.appendChild(myQtySpan)
      myLi32.appendChild(myPlusButton)

      myDetailColumn.appendChild(myLi32)
      myDetail.appendChild(myDetailColumn)
    }
    // then summary
    const myLi5 = document.createElement('div')
    myCartProductDiv.appendChild(myLi5)
    myLi5.innerText = itemToDisplay.qty
    const myLi6 = document.createElement('div')
    myCartProductDiv.appendChild(myLi6)
    myLi6.innerText = (itemToDisplay.unitPrice / 100).toString()
    const myLi7 = document.createElement('div')
    myCartProductDiv.appendChild(myLi7)
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
  // update cart item count
  if (localStorage.getItem('cart') === null) {
    console.log('No Cart, init it')
    theCart = new Cart(0, 0)
    updateGeneralQuantityAnPriceDisplayed(theCart)
  } else {
    try {
      console.log('One cart exist, get it')
      theCart = parse(localStorage.getItem('cart'))
      updateGeneralQuantityAnPriceDisplayed(theCart)
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
