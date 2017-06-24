function ParallaxElement(element) {
    var self = this;

    this.element = element;
    this.position = element.position;
    this.assetName = this.element.assetName;

    this.get = function () {
        return this.element.get();
    };

    this.loadAsset = function (engine, src) {
        // Copy value to nested element
        this.element.position = this.position;

        this.element.loadAsset(engine, src, function (err, element) {
            var builderCanvas = document.createElement("canvas");
            builderCanvas.width = self.position.width * 2;
            builderCanvas.height = self.position.height;

            var builderContext = builderCanvas.getContext('2d');

            builderContext.drawImage(element.get(), self.position.left, self.position.top, self.position.width, self.position.height);
            builderContext.drawImage(element.get(), self.position.width, self.position.top, self.position.width, self.position.height);

            self.position = new Position(self.position.top, self.position.left, self.position.width * 2, self.position.height, false, self.engine);
            self.element = new CanvasImage(builderCanvas, self.position);
        });
    };

    this.tick = function () {
        if (this.position.left <= -this.position.width / 2) {
            this.position.left = 0;
        }
        else {
            this.position.left--;
        }
    }
}

ParallaxElement.prototype = new ImageElement();

function CanvasImage(canvas, position) {
    this.canvas = canvas;
    this.position = position;

    this.get = function () {
        return this.canvas;
    }
}

CanvasImage.prototype = new Element();