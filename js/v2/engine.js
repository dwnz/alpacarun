function Engine(canvas, options, isDebug) {
    this.assetManager = new AssetManager();
    this.screen = new Screen(canvas, options);
    this.context = canvas.getContext("2d");

    this.scenes = [];

    this.addScene = function (scene) {
        this.scenes.push(scene);
    };

    this.createScene = function (name) {
        return new Scene(this, name);
    };

    this.addAsset = function (asset) {
        this.assetManager.addAsset(asset);
    };

    this.run = function () {
        this.screen.resize(canvas);
        this.scenes[0].paint(canvas);
    };
}