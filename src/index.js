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
    myCard.href = "#";
    myHtmlContent.appendChild(myCard);
    const myCardPicture = document.createElement("img");
    myCardPicture.src = myBear.imageUrl + "?w=380&h=380"; //imageUrlTest;
    myCard.appendChild(myCardPicture);
    const myCardTitle = document.createElement("p")
    myCard.appendChild(myCardTitle);
    const myCardTitleText = document.createTextNode(myBear.name);
    myCardTitle.appendChild(myCardTitleText);
}

