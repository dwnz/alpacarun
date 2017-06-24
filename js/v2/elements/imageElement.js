function ImageElement(assetName) {
    var self = this;

    this.assetName = assetName;
    this.position = null;

    this.loadAsset = function (engine, src, callback) {
        console.log("LOAD ASSET", src);
        this.image = new Image();
        this.image.onload = function () {
            if (callback) {
                callback(null, self);
            }

            self.resize(engine);
        };
        this.image.src = src;
    };

    this.get = function () {
        return this.image;
    };

    return this;
}

ImageElement.prototype = new Element();
