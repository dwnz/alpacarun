function UIHelper(c) {
    var toType = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    };

    this.LoadAndSizeImage = function (img) {
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

        img.cHeight = imgHeight;
        img.cWidth = imgWidth;
    };

    return this;
}