function Position(top, left, width, height, allowScale, engine) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.allowScale = allowScale === undefined ? true : allowScale;

    this.originalSize = {
        top: top,
        left: left,
        width: width,
        height: height
    };

    if (typeof this.originalSize.width === 'string') {
        var percentage = parseFloat(this.originalSize.width.replace('%', '')) / 100;
        this.width = Math.floor(engine.screen.width / percentage);
    }

    if (typeof this.originalSize.height === 'string') {
        if (this.height === 'auto') {
            if (this.image.width > this.image.height) {
                var ratio = this.image.width / this.image.height;
                this.height = Math.floor(this.width * ratio);
            } else {
                var ratio = this.image.height / this.image.width;
                this.height = Math.floor(this.width * ratio);
            }
        } else {
            var percentage = parseFloat(this.originalSize.height.replace('%', '')) / 100;
            this.height = Math.floor(engine.screen.height / percentage);
        }
    }

    if (typeof this.originalSize.top === 'string') {
        if (this.originalSize.top === 'center') {
            this.top = Math.floor((engine.screen.height / 2) - (this.height / 2));
        } else {
            var percentage = parseFloat(this.originalSize.top.replace('%', '')) / 100;
            this.top = Math.floor(engine.screen.height / percentage);
        }
    }

    if (typeof this.originalSize.left === 'string') {
        if (this.originalSize.left === 'center') {
            this.left = Math.floor((engine.screen.width / 2) - (this.width / 2));
        } else {
            var percentage = parseFloat(this.originalSize.left.replace('%', '')) / 100;
            this.left = Math.floor(engine.screen.width / percentage);
        }
    }

    this.right = function () {
        return this.left + this.width;
    };

    this.bottom = function () {
        return this.top + this.height;
    };

    return this;
}