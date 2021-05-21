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
  console.log('display 1 : ')
  console.log(url)
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
    element.src = JSON.parse(localStorage.getItem(url + suffix))
  }
}

/**
 *
 * @param teddy
 * @param selectedColor
 */
export const setPreselectedItem = async (teddy, selectedColor) => {
  const preselectedTeddyColor = {
    id: teddy._id,
    color: selectedColor,
    qty: 1,
    unitPrice: teddy.price,
    name: teddy.name,
    imageUrl: teddy.imageUrl
  }
  localStorage.setItem('preselected', JSON.stringify(preselectedTeddyColor))
  // allow add to cart button
  document.getElementById('addToCart').classList.replace('disabled', 'active')
}