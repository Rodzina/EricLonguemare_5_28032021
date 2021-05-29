import {
  displayAndStorePicture,
  parse,
  sortingTheCartTeddiesArray,
  stringify,
  updateColorsQty,
  updateGeneralQuantityAnPriceDisplayed,
  updateTeddyQuantityToDisplayForColor
} from './helpers/common'

/**
 *
 */
const validateClientForm = (theClient) => {
  // do something
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          console.log('formulaire KO')
          event.preventDefault()
          event.stopPropagation()
        } else {
          // If all forms field are OK
          // set client object
          console.log('Formulaire OK')
          event.preventDefault()
          event.stopPropagation()
          theClient.firstName = document.getElementById('firstName').value
          theClient.lastName = document.getElementById('lastName').value
          theClient.address = document.getElementById('address').value
          theClient.city = document.getElementById('city').value
          theClient.email = document.getElementById('email').value
          // then try to store it
          try {
            localStorage.setItem('client', JSON.stringify(theClient))
          } catch (e) {
            console.log('Cant save client datas' + e)
          }
          // then add order to local storage

          // then process API POST
          // curl -X POST -H "Content-Type: application/json" -d '{"contact": {"firstName": "testFirstname", "lastName": "testLastName", "address": "adresse de test", "city": "cityTest", "email": "email@test.com"}, "products": ["5beaa8bf1c9d440000a57d94"]}' https://polar-retreat-13131.herokuapp.com/api/teddies/order
          // on success save response
          // if failed stay on cart page

          const myHeaders = new Headers()
          myHeaders.append('Content-Type', 'application/json')

          const myInit =
            {
              method: 'POST',
              body: '{"contact": {"firstName": "testFirstname", "lastName": "testLastName", "address": "adresse de test", "city": "cityTest", "email": "email@test.com"}, "products": ["5beaa8bf1c9d440000a57d94"]}',
              headers: myHeaders
              // mode: 'cors',
              // cache: 'default'
            }

          const myRequest = new Request('https://polar-retreat-13131.herokuapp.com/api/teddies/order', myInit)

          fetch(myRequest).then(function (response) {
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.indexOf('application/json') !== -1) {
              return response.json().then(function (json) {
                // process JSON response
                console.log('Success : order submitted and validated')
                console.log(json)
              })
            } else {
              console.log('We dont have a response !')
            }
          })
        }
        form.classList.add('was-validated')
      }, false)
    })
}

/**
 *
 * @param theCart
 * @param theClient
 * @returns {Promise<void>}
 */
export const displayCartPage = async (theCart, theClient) => {
  const htmlContent = document.getElementById('content')
  const blockQuote = document.createElement('blockquote')
  const cartContent = document.createElement('div')

  blockQuote.innerText = 'Article(s) : ' + theCart.totalNumber + ' - ' + 'Montant total : ' + theCart.totalAmount / 100

  // sort theCart.items on teddy name to preserve order of items in cart
  theCart.items = sortingTheCartTeddiesArray(theCart.items)

  const length = theCart.items.length

  for (let i = 0, max = length; i < max; i++) {
    const itemToDisplay = parse(theCart.items[i])
    const itemDiv = document.createElement('div')
    const itemDivClasses = ['card', 'd-flex']
    itemDiv.classList.add(...itemDivClasses)
    itemDiv.setAttribute('id', itemToDisplay.id + 'card')
    const teddyPicture = document.createElement('img')
    teddyPicture.classList.add('card-img-top')
    teddyPicture.crossOrigin = 'anonymous'
    teddyPicture.setAttribute('alt', itemToDisplay.name)
    await displayAndStorePicture(teddyPicture, itemToDisplay.imageUrl, 'w=380&h=380&height=250&f=webp&crop=cover', '+small')
      .catch(err => console.log(err))
    itemDiv.appendChild(teddyPicture)
    const teddyID = document.createElement('div')
    itemDiv.appendChild(teddyID)
    teddyID.innerText = 'id :' + itemToDisplay.id
    const teddyName = document.createElement('h2')
    teddyName.classList.add('card-title-font')
    itemDiv.appendChild(teddyName)
    teddyName.innerText = itemToDisplay.name
    // create column for each color from colors - detail
    const teddyColorsDetailContainer = document.createElement('div')
    const myDetailClasses = ['d-flex', 'flex-row', 'justify-content-evenly', 'flex-wrap']
    teddyColorsDetailContainer.classList.add(...myDetailClasses)
    itemDiv.appendChild(teddyColorsDetailContainer)
    for (const [key, value] of Object.entries(itemToDisplay.colors)) {
      const DetailsDiv = document.createElement('div')
      DetailsDiv.classList.add('justify-content-center')
      const colorDiv = document.createElement('div')
      DetailsDiv.appendChild(colorDiv)
      colorDiv.innerText = key
      const colorDivContainer = document.createElement('div')
      const minusButton = document.createElement('button')
      minusButton.setAttribute('type', 'button')
      minusButton.setAttribute('autocomplete', 'off')
      minusButton.setAttribute('value', key.toString())
      const minusButtonIcon = document.createElement('i')
      minusButtonIcon.classList.add('bi', 'bi-dash-circle-fill')
      minusButtonIcon.setAttribute('aria-label', 'Enlever un ' + itemToDisplay.name + ' de couleur ' + key.toString())
      minusButton.appendChild(minusButtonIcon)
      minusButton.onclick = function () {
        console.log('Button minus Clicked')
        console.log(itemToDisplay.id)
        for (let z = 0, max = theCart.items.length; z < max; z++) {
          console.log(theCart.items.length)
          const itemToCheck = parse(theCart.items[z])
          console.log(itemToCheck.id)
          if (itemToDisplay.id === itemToCheck.id) {
            console.log('Minus : itemToDisplay = itemToCheck')
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
      const qtySpan = document.createElement('span')
      qtySpan.setAttribute('id', itemToDisplay.id + key.toString().replace(' ', '').toUpperCase())
      qtySpan.innerText = value.toString()
      const plusButton = document.createElement('button')
      plusButton.setAttribute('type', 'button')
      plusButton.setAttribute('autocomplete', 'off')
      plusButton.setAttribute('value', key.toString())
      const plusButtonIcon = document.createElement('i')
      plusButtonIcon.classList.add('bi', 'bi-plus-circle-fill')
      plusButtonIcon.setAttribute('aria-label', 'Ajouter un ' + itemToDisplay.name + ' de couleur ' + key.toString())
      plusButton.appendChild(plusButtonIcon)
      plusButton.onclick = function () {
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
      }
      colorDivContainer.appendChild(minusButton)
      colorDivContainer.appendChild(qtySpan)
      colorDivContainer.appendChild(plusButton)

      DetailsDiv.appendChild(colorDivContainer)
      teddyColorsDetailContainer.appendChild(DetailsDiv)
    }
    // then summary
    const itemQty = document.createElement('div')
    itemDiv.appendChild(itemQty)
    itemQty.innerText = itemToDisplay.qty
    const itemUnitPrice = document.createElement('div')
    itemDiv.appendChild(itemUnitPrice)
    itemUnitPrice.innerText = (itemToDisplay.unitPrice / 100).toString()
    const itemTotalAmount = document.createElement('div')
    itemDiv.appendChild(itemTotalAmount)
    itemTotalAmount.innerText = ((itemToDisplay.unitPrice / 100) * itemToDisplay.qty).toString()
    cartContent.appendChild(itemDiv)
  }

  // build client infos
  // check if we have client infos
  let isTheClientKnown = false

  console.log(theClient)
  if (theClient.firstName && theClient.lastName && theClient.address && theClient.city && theClient.email) {
    // do something
    console.log('Client infos are not empty and stored in local Storage')
    console.log(theClient)
    isTheClientKnown = true
  }
  const mClientInfosDiv = document.createElement('form')
  mClientInfosDiv.classList.add('needs-validation')
  mClientInfosDiv.setAttribute('novalidate', '')
  // firstName
  const mFirstNameDiv = document.createElement('div')
  const firstName = document.createElement('input')
  firstName.setAttribute('id', 'firstName')
  firstName.setAttribute('type', 'text')
  if (isTheClientKnown) {
    firstName.value = theClient.firstName
  } else {
    firstName.setAttribute('placeholder', 'Prénom')
  }
  firstName.setAttribute('aria-label', 'Prénom')
  firstName.setAttribute('required', '')
  firstName.classList.add('form-control')
  const validFeedBackForFirstName = document.createElement('div')
  validFeedBackForFirstName.classList.add('valid-feedback')
  validFeedBackForFirstName.innerText = 'C\'est tout bon !'
  const invalidFeedBackForFirstName = document.createElement('div')
  invalidFeedBackForFirstName.classList.add('invalid-feedback')
  invalidFeedBackForFirstName.innerText = 'Tu as un prénom ?'
  mFirstNameDiv.appendChild(firstName)
  mFirstNameDiv.appendChild(validFeedBackForFirstName)
  mFirstNameDiv.appendChild(invalidFeedBackForFirstName)
  mClientInfosDiv.appendChild(mFirstNameDiv)
  // lastName
  const mLastNameDiv = document.createElement('div')
  const lastName = document.createElement('input')
  lastName.setAttribute('id', 'lastName')
  lastName.setAttribute('type', 'text')
  if (isTheClientKnown) {
    lastName.value = theClient.lastName
  } else {
    lastName.setAttribute('placeholder', 'Nom')
  }
  lastName.setAttribute('aria-label', 'Nom')
  lastName.setAttribute('required', '')
  lastName.classList.add('form-control')
  const validFeedBackForLastName = document.createElement('div')
  validFeedBackForLastName.classList.add('valid-feedback')
  validFeedBackForLastName.innerText = 'C\'est bon !'
  const invalidFeedBackForLastName = document.createElement('div')
  invalidFeedBackForLastName.classList.add('invalid-feedback')
  invalidFeedBackForLastName.innerText = 'C quoi ton nom ???'
  mLastNameDiv.appendChild(lastName)
  mLastNameDiv.appendChild(validFeedBackForLastName)
  mLastNameDiv.appendChild(invalidFeedBackForLastName)
  mClientInfosDiv.appendChild(mLastNameDiv)
  // address
  const mAddressDiv = document.createElement('div')
  const address = document.createElement('input')
  address.setAttribute('id', 'address')
  address.setAttribute('type', 'text')
  if (isTheClientKnown) {
    address.value = theClient.address
  } else {
    address.setAttribute('placeholder', 'Adresse')
  }
  address.setAttribute('aria-label', 'Adresse')
  address.setAttribute('required', '')
  address.classList.add('form-control')
  const validFeedBackForAddress = document.createElement('div')
  validFeedBackForAddress.classList.add('valid-feedback')
  validFeedBackForAddress.innerText = 'C\'est OK ici !'
  const invalidFeedBackForAddress = document.createElement('div')
  invalidFeedBackForAddress.classList.add('invalid-feedback')
  invalidFeedBackForAddress.innerText = 'Une adresse SVP !'
  mAddressDiv.appendChild(address)
  mAddressDiv.appendChild(validFeedBackForAddress)
  mAddressDiv.appendChild(invalidFeedBackForAddress)
  mClientInfosDiv.appendChild(mAddressDiv)
  // city
  const mCityDiv = document.createElement('div')
  const city = document.createElement('input')
  city.setAttribute('id', 'city')
  city.setAttribute('type', 'text')
  if (isTheClientKnown) {
    city.value = theClient.city
  } else {
    city.setAttribute('placeholder', 'Ville')
  }
  city.setAttribute('aria-label', 'Ville')
  city.setAttribute('required', '')
  city.classList.add('form-control')
  const validFeedBackForCity = document.createElement('div')
  validFeedBackForCity.classList.add('valid-feedback')
  validFeedBackForCity.innerText = 'C\'est bon ! Pas de fautes d\'orthographe ??'
  const invalidFeedBackForCity = document.createElement('div')
  invalidFeedBackForCity.classList.add('invalid-feedback')
  invalidFeedBackForCity.innerText = 'Quelle est ta ville ??'
  mCityDiv.appendChild(city)
  mCityDiv.appendChild(validFeedBackForCity)
  mCityDiv.appendChild(invalidFeedBackForCity)
  mClientInfosDiv.appendChild(mCityDiv)
  // email
  const mEmailDiv = document.createElement('div')
  const email = document.createElement('input')
  email.setAttribute('id', 'email')
  email.setAttribute('type', 'email')
  if (isTheClientKnown) {
    email.value = theClient.email
  } else {
    email.setAttribute('placeholder', 'Email')
  }
  email.setAttribute('aria-label', 'email')
  email.setAttribute('required', '')
  email.classList.add('form-control')
  const validFeedBackForEmail = document.createElement('div')
  validFeedBackForEmail.classList.add('valid-feedback')
  validFeedBackForEmail.innerText = 'C\'est bon ! Super !'
  const invalidFeedBackForEmail = document.createElement('div')
  invalidFeedBackForEmail.classList.add('invalid-feedback')
  invalidFeedBackForEmail.innerText = 'Pas de mail, un @ qui manque, un domaine : monmail@monhebergeur.tld ?'
  mEmailDiv.appendChild(email)
  mEmailDiv.appendChild(validFeedBackForEmail)
  mEmailDiv.appendChild(invalidFeedBackForEmail)
  mClientInfosDiv.appendChild(mEmailDiv)
  // submit button
  const orderButton = document.createElement('button')
  orderButton.setAttribute('type', 'submit')
  orderButton.setAttribute('aria-label', 'Commander')
  const buttonClasses = ['btn', 'btn-outline-success', 'enabled']
  orderButton.classList.add(...buttonClasses)
  orderButton.innerText = 'Commander'
  orderButton.onclick = function () {
    // do something
    console.log('Button process order clicked')
    // check infos are completed then enable order button and create client object
    // see validateClientForm()
    // https://developer.mozilla.org/fr/docs/Learn/Forms/Form_validation
    // https://getbootstrap.com/docs/5.0/forms/validation/
    // build and send API post then check if order is registered
    // if registered create order object from cart with order id to build ordered items list
    // then remove cart object
    // go to congratulation page and order confirmed page
  }
  mClientInfosDiv.appendChild(orderButton)
  // add content to page
  htmlContent.appendChild(blockQuote)
  htmlContent.appendChild(cartContent)
  htmlContent.appendChild(mClientInfosDiv)

  await validateClientForm(theClient)
}
