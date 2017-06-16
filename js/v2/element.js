function Element() {
    this.get = function () {
        throw new Error("Must overwrite this function");
    }
}

function ImageElement(assetName) {
    this.assetName = assetName;

    this.loadAsset = function (src) {
        this.image = new Image();
        this.image.src = src;

    };

    this.get = function () {
        return this.image;
    };

    this.resize = function () {

    };

    return this;
}

ImageElement.prototype = new Element();