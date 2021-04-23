import * as bootstrap from 'bootstrap';
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
//import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
//styles personnalisés
import './assets/scss/custom.scss'; // Import our scss file

let is_index = location.pathname === "/EricLonguemare_5_28032021/dist/";

class Teddie {
    constructor(_id, colors, name, description, imageUrl, price) {
        this._id = _id;
        this.colors = colors;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
    }
}

/**
 * async fetch of API url for JSON response
 * @param entryPoint
 * @returns {Promise<Response>}
 */
async function fetchTeddies(entryPoint) {
    return await fetch(entryPoint);
}

/**
 *
 * @param response
 */
function displayTeddies(response) {
    response.json()
        .then(datas => {
            datas.forEach(row => {
                let b = new Teddie(row._id, row.colors, row.name, row.description, row.imageUrl, row.price);
                displayTeddie(b);
            })
        })
}

/**
 * build html for one teddie card
 * @param myTeddie {{_id: string, colors: array.<string>, name: string, description: string, imageUrl: string, price: number}}
 */
function displayTeddie(myTeddie) {
    const myHtmlContent = document.getElementById("content");
    const myCard = document.createElement("a");
    ["card", "card-width-350", "m-2"].forEach(className => myCard.classList.add(className));
    myCard.href = "/" + encodeURI(myTeddie.name).replace(/%20/g, '-');
    myCard.addEventListener("click", function () {
        console.log("clicked:" + myTeddie._id);
        sessionStorage.setItem('_id', myTeddie._id);
    })
    myHtmlContent.appendChild(myCard);
    const myCardPicture = document.createElement("img");
    myCardPicture.src = myTeddie.imageUrl.replace(/^http:\/\//i, 'https://') + "?w=380&h=380";
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
 */
function displayTeddieDetails() {
    console.log("erase");
    const myHtmlContent = document.getElementById("content");
    myHtmlContent.innerHTML = "TEST :" + sessionStorage.getItem('_id');
}

/**
 *
 */
function process() {
    console.log("Is_index :" + is_index);
    if (is_index) {
        const entryPoint = "https://polar-retreat-13131.herokuapp.com/api/teddies/";
        fetchTeddies(entryPoint)
            .then(response => displayTeddies(response));
    } else {
        displayTeddieDetails();
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

