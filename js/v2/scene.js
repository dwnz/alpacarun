function Scene(engine, name) {
    this.engine = engine;
    this.name = name;

    this.elements = [];

    this.addElement = function (element, top, left, width, height) {
        element.position = new Position(top, left, width, height);
        element.asset = this.engine.assetManager.get(element.assetName);
        element.loadAsset(element.asset.src);

        this.elements.push(element);
    };

    this.paint = function () {
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            var width = element.position.width;
            var height = element.position.height;

            if (typeof element.position.width === 'string') {
                var percentage = parseFloat(element.position.width.replace('%', '')) / 100;
                width = this.engine.screen.width / percentage;
            }

            if (typeof element.position.height === 'string') {
                var percentage = parseFloat(element.position.height.replace('%', '')) / 100;
                height = this.engine.screen.height / percentage;
            }

            this.engine.context.drawImage(
                element.get(),
                0,
                0,
                800,
                600
                /*element.position.top,
                 element.position.left,
                 width,
                 height*/
            );
        }
    };
}