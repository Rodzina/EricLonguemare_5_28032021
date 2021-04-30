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

    static createFromJSON(teddyInfo) {
        try {
            return Object.assign(new Teddy(), JSON.parse(teddyInfo));
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

class Cart {
    constructor() {
        this.items = [];
    }
}

/**
 *
 * @returns {{baseurl: string, url: URL}}
 */
function getUrl() {
    const url = new URL(location.href), hostname = url.hostname, pathname = url.pathname, protocol = url.protocol,
        port = url.port;
    let baseUrl = protocol + "//" + hostname;
    switch ("localhost") {
        case hostname: // we are on dev host
            baseUrl += ":" + port;
            break;
        default:
            let segments = pathname.split("/")
            for (let index = 0; index < segments.length - 1; ++index) {
                baseUrl += segments[index] + "/"
            }
            break;
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
async function fetchFromAPI(entryPoint) {
    return await fetch(entryPoint)
        .catch(err => console.log(err));
}


/**
 *
 * @param element
 * @param teddy
 * @param params
 * @param suffix
 * @returns {Promise<void>}
 */
async function displayAndStoreTeddyPicture(element, teddy, params, suffix) {
    if (localStorage.getItem(teddy.imageUrl + suffix) === null) {
        element.addEventListener("load", function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = element.width;
            canvas.height = element.height;
            ctx.drawImage(element, 0, 0, element.width, element.height);
            try {
                localStorage.setItem(teddy.imageUrl + suffix, JSON.stringify(canvas.toDataURL("image/webp")));
            } catch (e) {
                console.log("Storage failed: " + e);
            }
        }, false)
        element.src = teddy.imageUrl.replace(/^http:\/\//i, 'https://') + "?" + params;
    } else {
        element.src = JSON.parse(localStorage.getItem(teddy.imageUrl + suffix));
    }
}

/**
 * @param response
 */
async function displayAllTeddies(response) {
    await response.json()
        .then(datas => {
            for (const row of datas) {
                const myTeddy = new Teddy(row.colors, row._id, row.name, row.description, row.imageUrl, row.price);
                displayOneTeddie(myTeddy);
                myTeddy.store(); // put item in local storage.
            }
        })
}

/**
 * build html for one teddie card on home page
 * @param myTeddie {{colors: array.<string>, _id: string, name: string, description: string, imageUrl: string, price: number}}
 */
async function displayOneTeddie(myTeddie) {
    const myHtmlContent = document.getElementById("content");
    const myCard = document.createElement("a");
    for (let i = 0; i < ["card", "card-width-350", "m-2"].length; i++) {
        const className = ["card", "card-width-350", "m-2"][i];
        myCard.classList.add(className);
    }
    myCard.href = getUrl().url + "teddy.html" + "?" + "id=" + myTeddie._id;
    myCard.addEventListener("click", function () {
        sessionStorage.setItem('_id', myTeddie._id);
    })
    myHtmlContent.appendChild(myCard);
    const myCardPicture = document.createElement("img");
    myCardPicture.crossOrigin = "anonymous";
    myCardPicture.setAttribute("width", "380px");
    myCardPicture.setAttribute("height", "250px");


    await displayAndStoreTeddyPicture(myCardPicture, myTeddie, "w=380&h=380&height=250&f=webp&&crop=cover", "+small")
        .catch(err => console.log(err));

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
 * @param mTeddy
 */
async function displayTeddyDetails(mTeddy) {
    document.title += " - " + mTeddy.name;
    document.head.children.namedItem('keywords').content += ", " + mTeddy.name;
    document.head.children.namedItem('description').content += " " + mTeddy.name + ".";
    const myH1 = document.getElementById("teddyname");
    myH1.innerText = mTeddy.name;
    myH1.classList.add("text-highlighted");

    const myHtmlContent = document.getElementById("content");

    const myProductPage = document.createElement("div");
    myHtmlContent.appendChild(myProductPage);

    const myProductPicture = document.createElement("img");
    myProductPicture.crossOrigin = "anonymous";
    //myProductPicture.setAttribute("width", "380px");
    //myProductPicture.setAttribute("height", "250px");

    await displayAndStoreTeddyPicture(myProductPicture, mTeddy, "f=webp", "+big")
        .catch(err => console.log(err));
    myProductPicture.alt = mTeddy.name;
    myProductPicture.classList.add("card-img-top");
    myProductPage.appendChild(myProductPicture);

    const myProductPage2 = document.createElement("div");
    myHtmlContent.appendChild(myProductPage2);

    const myProductPageDescription = document.createElement("p");
    myProductPage2.appendChild(myProductPageDescription);
    const myProductPageDescriptionText = document.createTextNode(mTeddy.description);
    myProductPageDescription.appendChild(myProductPageDescriptionText);

    const myProductPagePrice = document.createElement("p");
    myProductPage2.appendChild(myProductPagePrice);
    const myProductPagePriceValue = document.createTextNode(mTeddy.price);
    myProductPagePrice.appendChild(myProductPagePriceValue);

    for (let i = 0; i < mTeddy.colors.length; i++){
        const option = mTeddy.colors[i];
        const myProductPageOptions = document.createElement("p");
        myProductPage2.appendChild(myProductPageOptions);
        const myProductPageOptionsValues = document.createTextNode(option);
        myProductPageOptions.appendChild(myProductPageOptionsValues);
    }
}

/**
 *
 */
async function process() {
    const homeURL = document.getElementById("homepage");
    homeURL.href = getUrl().baseurl;
    const entryPoint = "https://polar-retreat-13131.herokuapp.com/api/teddies/";
    const params = new URLSearchParams(location.search);
    if (!params.has("id")) {
        fetchFromAPI(entryPoint)
            .then(response => displayAllTeddies(response));
    } else {
        const m_id = params.get("id");
        let myTeddy;
        if (m_id in localStorage) {
            myTeddy = await Teddy.createFromJSON(localStorage.getItem(m_id));
        } else {
            const teddyInfo = await fetchFromAPI(entryPoint + m_id)
                .then(response => response.json())
                .then(value => JSON.stringify(value))
            myTeddy = await Teddy.createFromJSON(teddyInfo)
        }

        await myTeddy.store();
        await displayTeddyDetails(myTeddy);
    }
}

process()
    .catch(err => console.log(err));

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

