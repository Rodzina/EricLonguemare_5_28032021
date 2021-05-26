import * as bootstrap from 'bootstrap'
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
// import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
// styles personnalisés
import { Teddy } from './classes/teddy' // Import our Teddy classes
import { Cart } from './classes/cart' // Import our Cart classes
import { Client } from './classes/client' // Import our Cart classes
import { fetchFromAPI, getUrl, parse, stringify, updateGeneralQuantityAnPriceDisplayed } from './helpers/common' // Import helpers
import { displayCartPage } from './displayCartPage'
import { displayTeddyPage } from './displayTeddyPage'
import { displayHome } from './displayHome'

/**
 *
 * @returns {Promise<void>}
 */
const process = async () => {
  // cart init
  let theCart
  // client init
  let theClient
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
  if (localStorage.getItem('client') === null) {
    console.log('No client infos, init them')
    theClient = new Client()
  } else {
    try {
      console.log('The client infos exist, get it')
      theClient = parse(localStorage.getItem('client'))
    } catch (e) {
      console.log('Error : Cant get client infos' + e)
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
    await displayCartPage(theCart, theClient)
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
