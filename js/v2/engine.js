function Engine(canvas, options, isDebug) {
    console.log(arguments);
    var self = this;

    this.assetManager = new AssetManager();
    this.screen = new Screen(canvas, options);
    this.context = canvas.getContext("2d");

    this.scenes = [];
    this.currentScene = 0;

    if (isDebug) {
        console.log("Setup debug");
        this.debug = new Debug(this);
    }

    /**
     * Adds a scene to the scene buffer
     * @param scene
     */
    this.addScene = function (scene) {
        this.scenes.push(scene);
    };

    /**
     * Creates a new scene
     * @param name Must be unique
     * @returns {Scene}
     */
    this.createScene = function (name) {
        return new Scene(this, name);
    };

    /**
     * Adds an asset to the asset register
     * @param asset
     */
    this.addAsset = function (asset) {
        this.assetManager.addAsset(asset);
    };

    /**
     * Runs the game loop after preloading the assets
     */
    this.runGameLoop = function () {
        self.assetManager.preloadAssets(function () {
            requestAnimationFrame(self.drawCurrentScene);
        });
    };

    /**
     * Draws the current scene to the canvas
     */
    this.drawCurrentScene = function () {
        self.screen.resize(canvas);
        self.scenes[self.currentScene].paint(canvas);

        requestAnimationFrame(self.drawCurrentScene);
    };
}