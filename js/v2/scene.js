function Scene(engine, name) {
    this.engine = engine;
    this.name = name;

    this.elements = [];

    this.addElement = function (element, top, left, width, height) {
        element.position = new Position(top, left, width, height);
        element.asset = this.engine.assetManager.get(element.assetName);
        element.loadAsset(engine, element.asset.src);

        this.elements.push(element);
    };

    this.paint = function () {
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            this.engine.context.drawImage(
                element.get(),
                element.position.left,
                element.position.top,
                element.position.width,
                element.position.height
            );
        }
    };
}