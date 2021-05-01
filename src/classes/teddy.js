export class Teddy {
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