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
 * @param theCart
 * @returns {Promise<void>}
 */
export const displayCartPage = async theCart => {
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
  htmlContent.appendChild(blockQuote)
  htmlContent.appendChild(cartContent)
}
