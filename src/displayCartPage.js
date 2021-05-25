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
    teddyPictureElement.setAttribute('alt', itemToDisplay.name)
    await displayAndStorePicture(teddyPictureElement, itemToDisplay.imageUrl, 'w=380&h=380&height=250&f=webp&crop=cover', '+small')
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
