import { displayAndStorePicture, getUrl } from './helpers/common'
import { Teddy } from './classes/teddy'

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
export const displayHome = async response => {
  await response.json()
    .then(datas => {
      for (const row of datas) {
        const myTeddy = new Teddy(row.colors, row._id, row.name, row.description, row.imageUrl, row.price)
        displayTeddyCard(myTeddy)
        myTeddy.store() // put item in local storage.
      }
    })
}