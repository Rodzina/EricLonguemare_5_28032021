import {
  displayAndStorePicture,
  parse,
  setPreselectedItem,
  sortingTheCartTeddiesArray,
  stringify,
  updateColorsQty,
  updateGeneralQuantityAnPriceDisplayed
} from './helpers/common'

/**
 *
 * @param teddy
 * @param theCart
 * @returns {Promise<void>}
 */
export const displayTeddyPage = async function (teddy, theCart) {
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
