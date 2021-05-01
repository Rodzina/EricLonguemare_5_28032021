import * as bootstrap from 'bootstrap';
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
//import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
//styles personnalisés
import './assets/scss/custom.scss'; // Import our scss file
import {Teddy} from "./classes/teddy"; // Import our Teddy classes
import {Client} from "./classes/client"; // Import our Teddy classes

class Cart {
    constructor() {
        this.items = [];
    }
}

/**
 *
 * @returns {{baseurl: string, url: URL}}
 */
const getUrl = () => {
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
};

/**
 * async fetch of API url for JSON response
 * @param entryPoint
 * @returns {Promise<Response>}
 */
const fetchFromAPI = async entryPoint => await fetch(entryPoint)
    .catch(err => console.log(err));

/**
 *
 * @param element
 * @param teddy
 * @param params
 * @param suffix
 * @returns {Promise<void>}
 */
const displayAndStoreTeddyPicture = async (element, teddy, params, suffix) => {
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
};

/**
 * build html for one teddie card on home page
 * @param teddy {{colors: array.<string>, _id: string, name: string, description: string, imageUrl: string, price: number}}
 */
const displayTeddyCard = async teddy => {
    const myHtmlContent = document.getElementById("content");
    const myCard = document.createElement("a");
    for (let i = 0; i < ["card", "card-width-350", "m-2"].length; i++) {
        const className = ["card", "card-width-350", "m-2"][i];
        myCard.classList.add(className);
    }
    myCard.href = getUrl().url + "teddy.html" + "?" + "id=" + teddy._id;
    myCard.addEventListener("click", function () {
        sessionStorage.setItem('_id', teddy._id);
    })
    myHtmlContent.appendChild(myCard);
    const myCardPicture = document.createElement("img");
    myCardPicture.crossOrigin = "anonymous";
    myCardPicture.setAttribute("width", "380px");
    myCardPicture.setAttribute("height", "250px");


    await displayAndStoreTeddyPicture(myCardPicture, teddy, "w=380&h=380&height=250&f=webp&&crop=cover", "+small")
        .catch(err => console.log(err));

    myCardPicture.alt = teddy.name;
    myCard.appendChild(myCardPicture);
    myCardPicture.classList.add("card-img-top");
    const myCardTitle = document.createElement("h2");
    myCard.appendChild(myCardTitle);
    myCardTitle.classList.add("card-title-font");
    myCardTitle.classList.add("pt-4");
    const myCardTitleText = document.createTextNode(teddy.name);
    myCardTitle.appendChild(myCardTitleText);
};

/**
 * @param response
 */
const displayHome = async response => {
    await response.json()
        .then(datas => {
            for (const row of datas) {
                const myTeddy = new Teddy(row.colors, row._id, row.name, row.description, row.imageUrl, row.price);
                displayTeddyCard(myTeddy);
                myTeddy.store(); // put item in local storage.
            }
        })
};

/**
 * @param teddy
 */
async function displayTeddyPage(teddy) {
    document.title += " | " + teddy.name;
    document.head.children.namedItem('keywords').content += ", " + teddy.name;
    document.head.children.namedItem('description').content += " " + teddy.name + ".";
    const teddyH1 = document.getElementById("teddyname");
    teddyH1.innerText = teddy.name;
    teddyH1.classList.add("text-highlighted");

    const htmlContent = document.getElementById("content");

    const teddyPictureDiv = document.createElement("div");
    htmlContent.appendChild(teddyPictureDiv);

    const teddyPicture = document.createElement("img");
    teddyPicture.crossOrigin = "anonymous";
    //teddyPicture.setAttribute("width", "380px");
    //teddyPicture.setAttribute("height", "250px");

    await displayAndStoreTeddyPicture(teddyPicture, teddy, "f=webp", "+big")
        .catch(err => console.log(err));
    teddyPicture.alt = teddy.name;
    teddyPicture.classList.add("card-img-top");
    teddyPictureDiv.appendChild(teddyPicture);

    const teddyInfosDiv = document.createElement("div");
    htmlContent.appendChild(teddyInfosDiv);

    const teddyDescription = document.createElement("p");
    teddyInfosDiv.appendChild(teddyDescription);
    const teddyDescriptionText = document.createTextNode(teddy.description);
    teddyDescription.appendChild(teddyDescriptionText);

    const teddyPrice = document.createElement("p");
    teddyInfosDiv.appendChild(teddyPrice);
    const teddyPriceValue = document.createTextNode(teddy.price);
    teddyPrice.appendChild(teddyPriceValue);

    const teddyColorsOptions = document.createElement("div");
    teddyColorsOptions.classList.add("btn-group");
    teddyColorsOptions.setAttribute("role", "group")
    teddyInfosDiv.appendChild(teddyColorsOptions);

    for (let i = 0; i < teddy.colors.length; i++) {
        const option = teddy.colors[i];
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "btnradio";
        input.setAttribute("id", "btnradio" + (i +1) );
        input.setAttribute("autocomplete", "off");
        input.classList.add("btn-check");
        teddyColorsOptions.appendChild(input);
        const optionLabel = document.createElement("label");
        const optionLabelClasses = ["btn", "btn-outline-primary"];
        for (let i1 = 0; i1 < optionLabelClasses.length; i1++) {
            const theClass = optionLabelClasses[i1];
            optionLabel.classList.add(theClass);
        }
        optionLabel.setAttribute("for", "btnradio" + (i +1))
        const optionLabelDescription = document.createTextNode(option);
        optionLabel.appendChild(optionLabelDescription);
        teddyColorsOptions.appendChild(optionLabel);
    }
}

/**
 *
 */
const process = async () => {
    const homeURL = document.getElementById("homepage");
    homeURL.href = getUrl().baseurl;
    const entryPoint = "https://polar-retreat-13131.herokuapp.com/api/teddies/";
    const params = new URLSearchParams(location.search);
    if (!params.has("id")) {
        fetchFromAPI(entryPoint)
            .then(response => displayHome(response));
    } else {
        const id = params.get("id");
        let teddy;
        if (id in localStorage) {
            teddy = await Teddy.createFromJSON(localStorage.getItem(id));
        } else {
            const teddyInfo = await fetchFromAPI(entryPoint + id)
                .then(response => response.json())
                .then(value => JSON.stringify(value))
            teddy = await Teddy.createFromJSON(teddyInfo)
        }

        await teddy.store();
        await displayTeddyPage(teddy);
    }
};

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

