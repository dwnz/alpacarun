function Screen(canvas, options) {
    var that = this;

    this.maxWidth = 800;
    this.maxHeight = 600;

    this.width = 0;
    this.height = 0;

    this.scale = 1;
    this.heightScale = 1;

    if (options && options.maxWidth) {
        this.maxWidth = options.maxWidth;
    }

    if (options && options.maxHeight) {
        this.maxHeight = options.maxHeight;
    }

    this.resize = function (canvas) {
        if (window.innerWidth < that.maxWidth) {
            that.width = window.innerWidth;
            that.scale = that.width / that.maxWidth;
        } else {
            that.width = that.maxWidth;
        }

        if (window.innerHeight < that.maxHeight) {
            that.height = window.innerHeight;
            that.heightScale = that.height / that.maxHeight;
        } else {
            that.height = that.maxHeight;
        }

        canvas.width = that.width;
        canvas.height = that.height;
    };

    this.resize(canvas);
    window.addEventListener('orientationchange', function () {
        that.resize(canvas);
    });
}