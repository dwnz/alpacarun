function UIHelper(c) {
    var self = this;

    var toType = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    };

    this.LoadAndSizeImage = function (img, callback) {
        if (toType(img) === 'event') {
            img = this;
        }

        var imgWidth = img.naturalWidth;
        var screenWidth = c.width;

        var scaleX = 1;
        if (imgWidth > screenWidth)
            scaleX = screenWidth / imgWidth;

        var imgHeight = img.naturalHeight;
        var screenHeight = c.height;

        var scaleY = 1;
        if (imgHeight > screenHeight)
            scaleY = screenHeight / imgHeight;

        var scale = scaleY;

        if (scaleX < scaleY)
            scale = scaleX;

        if (scale < 1) {
            imgHeight = imgHeight * scale;
            imgWidth = imgWidth * scale;
        }

        img.cHeight = Math.floor(imgHeight);
        img.cWidth = Math.floor(imgWidth);

        if (callback) {
            callback();
        }
    };

    this.LoadImage = function (src, callback) {
        var image = new Image();

        image.onload = function () {
            self.LoadAndSizeImage(image, function () {
                return callback(image);
            });
        };

        image.src = '/img/' + src;
    };

    return this;
}