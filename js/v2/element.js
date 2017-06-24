function Element() {
    this.position = null;

    this.get = function () {
        throw new Error("Must overwrite this function");
    };

    this.resize = function (engine) {
        if (!this.position) {
            throw new Error("Position must be an object");
        }

        if (typeof this.position.width === 'string') {
            var percentage = parseFloat(this.position.width.replace('%', '')) / 100;
            this.position.width = Math.floor(engine.screen.width / percentage);
        }

        if (typeof this.position.height === 'string') {
            if (this.position.height === 'auto') {
                if (this.image.width > this.image.width) {
                    var ratio = this.image.width / this.image.height;
                    this.position.height = Math.floor(this.position.width * ratio);
                } else {
                    var ratio = this.image.height / this.image.width;
                    this.position.height = Math.floor(this.position.width * ratio);
                }
            } else {
                var percentage = parseFloat(this.position.height.replace('%', '')) / 100;
                this.position.height = Math.floor(engine.screen.height / percentage);
            }
        }

        if (typeof this.position.top === 'string') {
            if (this.position.top === 'center') {
                this.position.top = Math.floor((engine.screen.height / 2) - (this.position.height / 2));
            } else {
                var percentage = parseFloat(this.position.top.replace('%', '')) / 100;
                this.position.top = Math.floor(engine.screen.height / percentage);
            }
        }

        if (typeof this.position.left === 'string') {
            if (this.position.left === 'center') {
                this.position.left = Math.floor((engine.screen.width / 2) - (this.position.width / 2));
            } else {
                var percentage = parseFloat(left.replace('%', '')) / 100;
                this.position.top = Math.floor(engine.screen.width / percentage);
            }
        }
    };
}