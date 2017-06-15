function UIHelper(c) {
    this.LoadAndSizeImage = function () {
        var imgWidth = this.naturalWidth;
        var screenWidth = c.width;

        var scaleX = 1;
        if (imgWidth > screenWidth)
            scaleX = screenWidth / imgWidth;

        var imgHeight = this.naturalHeight;
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

        this.cHeight = imgHeight;
        this.cWidth = imgWidth;
    };

    return this;
}