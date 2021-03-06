/**
 *
 * @returns {{baseurl: string, url: URL}}
 */
export const getUrl = () => {
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
export const fetchFromAPI = async entryPoint => await fetch(entryPoint)
  .catch(err => console.log(err))

/**
 *
 * @param element
 * @param url
 * @param params
 * @param suffix
 * @returns {Promise<void>}
 */
export const displayAndStorePicture = async (element, url, params, suffix) => {
  if (localStorage.getItem(url + suffix) === null) {
    element.addEventListener('load', function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = element.width
      canvas.height = element.height
      ctx.drawImage(element, 0, 0, element.width, element.height)
      try {
        localStorage.setItem(url + suffix, JSON.stringify(canvas.toDataURL('image/webp')))
      } catch (e) {
        console.log('Storage failed: ' + e)
      }
    }, false)
    element.src = url.replace(/^http:\/\//i, 'https://') + '?' + params
  } else {
    element.src = parse(localStorage.getItem(url + suffix))
  }
}

/**
 *
 * @param teddyColors
 * @param selectedColor
 * @returns {{}}
 */
export const initializeColorsObject = (teddyColors, selectedColor) => {
  // do something
  const newBuildObject = {}
  for (let i = 0, max = teddyColors.length; i < max; i++) {
    if (teddyColors[i] === selectedColor) {
      newBuildObject[teddyColors[i]] = 1
    } else {
      // do something
      newBuildObject[teddyColors[i]] = 0
    }
  }
  return newBuildObject
}

/**
 *
 * @param teddy
 * @param selectedColor
 */
export const setPreselectedItem = async (teddy, selectedColor) => {
  const preselectedTeddyColor = {
    id: teddy._id,
    colors: initializeColorsObject(teddy.colors, selectedColor),
    color: selectedColor,
    qty: 1,
    unitPrice: teddy.price,
    name: teddy.name,
    imageUrl: teddy.imageUrl
  }
  localStorage.setItem('preselected', stringify(preselectedTeddyColor))
  // We got a selected color : allow add to cart button
  document.getElementById('addToCart').classList.replace('disabled', 'active')
}

/**
 *
 * @param teddyColors
 * @param selectedColor
 * @param isMinus
 * @returns {{}}
 */
export const updateColorsQty = (teddyColors, selectedColor, isMinus) => {
  const updatedObject = {}

  if (!isMinus) {
    // add one teddy for ref and color, change quantity displayed
    for (const [key, value] of Object.entries(teddyColors)) {
      if (key === selectedColor) {
        console.log(' ?? mettre ?? jour : ' + key)
        updatedObject[key] = value + 1
      } else {
        updatedObject[key] = value
      }
    }
  } else {
    // remove one teddy for ref and color,  change quantity displayed
    for (const [key, value] of Object.entries(teddyColors)) {
      if (key === selectedColor) {
        console.log(' ?? mettre ?? jour : ' + key)
        updatedObject[key] = value - 1
      } else {
        updatedObject[key] = value
      }
    }
  }
  return updatedObject
}

/**
 *
 * @param theCart
 */
export const updateGeneralQuantityAndPriceDisplayed = (theCart) => {
  document.getElementById('itemnumber').innerText = theCart.totalNumber.toString()
  document.getElementById('totalamount').innerText = (theCart.totalAmount / 100).toString()
}

/**
 *
 * @param theCart
 */
export const updateCartHeadQuantityAndPriceDisplayed = (theCart) => {
  document.getElementById('articlenumber').innerText = theCart.totalNumber.toString()
  document.getElementById('articletotalprice').innerText = (theCart.totalAmount / 100).toString()
}

/**
 *
 */
export const forceGeneralQuantityAndPriceToZero = () => {
  document.getElementById('itemnumber').innerText = '0'
  document.getElementById('totalamount').innerText = '0'
  document.getElementById('articlenumber').innerText = '0'
  document.getElementById('articletotalprice').innerText = '0'
}

/**
 *
 * @param selectedColor
 * @param teddyColors
 * @param elementID
 */
export const updateTeddyQuantityToDisplayForColor = (selectedColor, teddyColors, elementID) => {
  console.log(elementID)
  const toUpdate = document.getElementById(elementID)
  for (const [key, value] of Object.entries(teddyColors)) {
    if (key === selectedColor) {
      console.log(' Update quantity displayed for : ' + key)
      toUpdate.innerText = value.toString()
    } else {
      //do something
    }
  }
}

/**
 *
 * @param itemID
 * @param unitPrice
 * @param isMinus
 */
export const updateTeddyQuantityToDisplayForId = (itemID, unitPrice, isMinus) => {
  const mElementQty = document.getElementById(itemID + 'qty')
  const mElementTotalAmount = document.getElementById(itemID + 'totalamount')
  let mValue = Number(mElementQty.innerText)
  let mUnitPrice = Number(unitPrice)
  mUnitPrice = mUnitPrice / 100

  if (isMinus) {
    mValue = mValue - 1
    mElementQty.innerText = mValue.toString()
    const mTotalAmount = mValue * mUnitPrice
    mElementTotalAmount.innerText = mTotalAmount.toString()
    //const mAmount =
  } else {
    mValue = mValue + 1
    mElementQty.innerText = mValue.toString()
    const mTotalAmount = mValue * mUnitPrice
    mElementTotalAmount.innerText = mTotalAmount.toString()
  }
}

/**
 *
 * @param items
 * @returns {*[]}
 */
export const sortingTheCartTeddiesArray = items => {
  // https://www.javascripttutorial.net/javascript-array-sort/
  // https://stackoverflow.com/questions/6129952/javascript-sort-array-by-two-fields
  const sortedArray = []
  const newArray = []
  for (let i = 0, max = items.length; i < max; i++) {
    sortedArray.push(parse(items[i]))
  }
  sortedArray.sort(function (x, y) {
    const a = x.name.toUpperCase()
    const b = y.name.toUpperCase()
    return a === b ? 0 : a > b ? 1 : -1
  })

  for (let i = 0, max = sortedArray.length; i < max; i++) {
    newArray.push(stringify(sortedArray[i]))
  }
  return newArray
}

/**
 *
 * @param string
 * @returns {string}
 */
export const stringify = string => JSON.stringify(string)

/**
 *
 * @param json
 * @returns {any}
 */
export const parse = json => JSON.parse(json)
