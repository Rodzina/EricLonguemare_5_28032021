import * as bootstrap from 'bootstrap';
// Supprimer les modules non utilisés. Si Popover, Tooltip, Dropdown sont utilisés : popper.js sera ajouté.
//import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Toast, Tooltip} from "bootstrap";
// utilise ESM
//styles personnalisés
import './assets/scss/custom.scss'; // Import our scss file

const entryPoint = "https://polar-retreat-13131.herokuapp.com/api/teddies/"

let bears = [];

class Bear {
    constructor(_id, colors, name, description, imageUrl, price) {
        this._id = _id;
        this.colors = colors;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
    }
}

fetch(entryPoint)
    .then(response => response.json())
    .then(datas => {
        datas.forEach(
            row => {
                let b = new Bear(row._id, row.colors, row.name, row.description, row.imageUrl, row.price);
                bears.push(b);
            })
        return bears;
    })
    .then(myBears => {
            myBears.forEach(
                myBear => {
                    displayBears(myBear)
                })
        }
    )

function displayBears(myBear) {
    const myHtmlContent = document.getElementById("content");
    const myCard = document.createElement("a");
    myCard.classList.add("card");
    myCard.classList.add("card-width-350")
    myCard.classList.add("m-2");
    myCard.href = "#";
    myHtmlContent.appendChild(myCard);
    const myCardPicture = document.createElement("img");
    myCardPicture.src = myBear.imageUrl.replace(/^http:\/\//i, 'https://') + "?w=380&h=380"; //imageUrlTest;
    myCard.appendChild(myCardPicture);
    myCardPicture.classList.add("card-img-top")
    const myCardTitle = document.createElement("h2")
    myCard.appendChild(myCardTitle);
    myCardTitle.classList.add("card-title-font");
    myCardTitle.classList.add("pt-4");
    const myCardTitleText = document.createTextNode(myBear.name);
    myCardTitle.appendChild(myCardTitleText);
}

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

