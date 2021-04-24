import * as bootstrap from 'bootstrap';
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
//import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
//styles personnalisés
import './assets/scss/custom.scss'; // Import our scss file

class Teddy {
    constructor(colors, _id, name, description, imageUrl, price) {
        this.colors = colors;
        this._id = _id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
    }

    store() {
        try {
            localStorage.setItem(this._id, JSON.stringify(this));
        } catch (e) {
            console.log("Store error :" + this._id + e);
        }
    }

    static async createFromJSON(mJSON) {
        try {
            const datas = await mJSON;
            return Object.assign(new Teddy(), JSON.parse(datas));
        } catch (e) {
            console.log("createFromJSON error :" + e);
        }

    }
}

class Client {
    constructor(firstName, lastName, address, city, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.adress = address;
        this.city = city;
        this.email = email;
    }
}

class Basket {
    constructor() {
        this.items = [];
    }
}


/**
 * async fetch of API url for JSON response
 * @param entryPoint
 * @returns {Promise<Response>}
 */
async function fetchFromAPI(entryPoint) {
    return await fetch(entryPoint);
}

/**
 * @param response
 */
async function displayAllTeddies(response) {
    await response.json()
        .then(datas => {
            datas.forEach(row => {
                const myTeddy = new Teddy(row.colors, row._id, row.name, row.description, row.imageUrl, row.price);
                displayOneTeddie(myTeddy);
                myTeddy.store(); // put item in local storage.
            })
        })
}

/**
 * build html for one teddie card
 * @param myTeddie {{colors: array.<string>, _id: string, name: string, description: string, imageUrl: string, price: number}}
 */
function displayOneTeddie(myTeddie) {
    const url = new URL(window.location.href);
    console.log("URL :" + url);
    const myHtmlContent = document.getElementById("content");
    const myCard = document.createElement("a");
    ["card", "card-width-350", "m-2"].forEach(className => myCard.classList.add(className));
    myCard.href = url + encodeURI(myTeddie.name).replace(/%20/g, '-') + "?" + "id=" + myTeddie._id;
    myCard.addEventListener("click", function () {
        sessionStorage.setItem('_id', myTeddie._id);
    })
    myHtmlContent.appendChild(myCard);
    const myCardPicture = document.createElement("img");
    myCardPicture.crossOrigin = "anonymous";
    myCardPicture.setAttribute("width", "380px");
    myCardPicture.setAttribute("height", "250px");
    if (localStorage.getItem(myTeddie.imageUrl) === null) {
        myCardPicture.addEventListener("load", function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = myCardPicture.width;
            canvas.height = myCardPicture.height;
            ctx.drawImage(myCardPicture, 0, 0, myCardPicture.width, myCardPicture.height);
            try {
                localStorage.setItem(myTeddie.imageUrl, JSON.stringify(canvas.toDataURL("image/webp")));
            } catch (e) {
                console.log("Storage failed: " + e);
            }
        }, false)
        myCardPicture.src = myTeddie.imageUrl.replace(/^http:\/\//i, 'https://') + "?w=380&h=380&height=250&f=webp&&crop=cover";
    } else {
        myCardPicture.src = JSON.parse(localStorage.getItem(myTeddie.imageUrl));
    }
    myCardPicture.alt = myTeddie.name;
    myCard.appendChild(myCardPicture);
    myCardPicture.classList.add("card-img-top");
    const myCardTitle = document.createElement("h2");
    myCard.appendChild(myCardTitle);
    myCardTitle.classList.add("card-title-font");
    myCardTitle.classList.add("pt-4");
    const myCardTitleText = document.createTextNode(myTeddie.name);
    myCardTitle.appendChild(myCardTitleText);
}

/**
 *
 * @param datas
 * @returns {Promise<*>}
 */
async function awaitTeddyDetails(datas) {
    try {
        return await datas;
    } catch (e) {
        console.log("awaitTeddyDetails :" + datas + e);
    }
}

/**
 *
 * @param datas
 * @returns {Promise<void>}
 */
async function storeTeddyDetails(datas) {
    try {
        await datas.store();
    } catch (e) {
        console.log("storeTeddyDetails :" + datas + e);
    }
}

/**
 *
 * @param datas
 * @returns {Promise<void>}
 */
async function displayTeddyDetails(datas) {
    const mTeddy = await datas;
    const myHtmlContent = document.getElementById("content");

    const myProductPage = document.createElement("div");
    myHtmlContent.appendChild(myProductPage);

    const myProductPicture = document.createElement("img");
    myProductPicture.src = mTeddy.imageUrl.replace(/^http:\/\//i, 'https://') + "?f=webp";
    myProductPage.appendChild(myProductPicture);
    //myProductPicture.classList.add("card-img-top");

    const myProductPageTitle = document.createElement("h2");
    myProductPage.appendChild(myProductPageTitle);
    myProductPageTitle.classList.add("card-title-font");
    const myProductPageTitleText = document.createTextNode(mTeddy.name);
    myProductPageTitle.appendChild(myProductPageTitleText);

    const myProductPage2 = document.createElement("div");
    myHtmlContent.appendChild(myProductPage2);

    const myProductPageDescription = document.createElement("p");
    myProductPage2.appendChild(myProductPageDescription);
    const myProductPageDescriptionText = document.createTextNode(mTeddy.description);
    myProductPageDescription.appendChild(myProductPageDescriptionText);

    const myProductPagePrice = document.createElement("p");
    myProductPage2.appendChild(myProductPagePrice);
    const myProductPagePriceValue = document.createTextNode(mTeddy.price);
    myProductPageDescription.appendChild(myProductPagePriceValue);

}

/**
 *
 */
function process() {
    const entryPoint = "https://polar-retreat-13131.herokuapp.com/api/teddies/";
    const params = new URLSearchParams(window.location.search);
    if (!params.has("id")) {
        fetchFromAPI(entryPoint)
            .then(response => displayAllTeddies(response));
    } else {
        const m_id = params.get("id");
        let myTeddy;
        if (m_id in localStorage) {
            myTeddy = Teddy.createFromJSON(localStorage.getItem(m_id));
        } else {
            myTeddy = Teddy.createFromJSON(
                fetchFromAPI(entryPoint + m_id)
                    .then(response => {
                        return response.json();
                    })
                    .then(value => {
                        return JSON.stringify(value);
                    })
            )
        }
        awaitTeddyDetails(myTeddy)
            .then(datas => {
                storeTeddyDetails(datas)
                return datas;
            })
            .then(datas => {
                return displayTeddyDetails(datas);
            })
    }
}

process();

//Check boostrap availability

if (typeof bootstrap !== 'undefined' || bootstrap !== null) {
    console.log("Alert version : " + bootstrap.Alert.VERSION);
    console.log("Button version : " + bootstrap.Button.VERSION);
    console.log("Popover version : " + bootstrap.Popover.VERSION);
    console.log("Tooltip version : " + bootstrap.Tooltip.VERSION);
    window.bootstrap = bootstrap;
} else {
    console.log("index.js : Bootstrap non défini");
}

