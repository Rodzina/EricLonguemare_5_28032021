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
 * @returns {*}
 */
export const updateColorsObject = (teddyColors, selectedColor) => {
  console.log(teddyColors)
  console.log(selectedColor)
  const updatedObject = {}

  for (const [key, value] of Object.entries(teddyColors)) {
    if (key === selectedColor) {
      console.log(" à mettre à jour : " + key)
      updatedObject[key] = value + 1
    } else {
      updatedObject[key] = value
    }
  }
  console.log(updatedObject)
return updatedObject
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