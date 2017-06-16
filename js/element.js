function Element() {
    var that = this;

    this.setup = function (canvas) {
        this.UIHelper = new UIHelper(canvas);
    };

    this.get = function () {
        throw new Error("Must overwrite this function");
    }
}

function ImageElement(canvas, src) {
    var that = this;
    this.setup(canvas);

    this.image = new Image();
    this.image.onload = function () {
        that.UIHelper.LoadAndSizeImage(that.image);
        that.width = that.image.cWidth;
        that.height = that.image.height;
    };
    this.image.src = src;

    this.get = function () {
        return this.image;
    };

    this.resize = function () {
        that.UIHelper.LoadAndSizeImage(that.image);
        that.width = that.image.cWidth;
        that.height = that.image.height;
    };

    return this;
}

ImageElement.prototype = new Element();