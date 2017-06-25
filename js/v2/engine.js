function Engine(canvas, options, isDebug) {
    var self = this;

    this.assetManager = new AssetManager();
    this.screen = new Screen(canvas, options);
    this.context = canvas.getContext("2d");

    this.scenes = [];
    this.currentScene = 0;

    if (isDebug) {
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
     * Changes the scene
     * @param name
     */
    this.changeScene = function (name) {
        this.detachEvents();
        this.scenes[this.currentScene].stop();

        for (var i = 0; i < this.scenes.length; i++) {
            if (this.scenes[i].name === name) {
                this.currentScene = i;
                self.attachEvents();
                this.scenes[this.currentScene].play();
                return;
            }
        }

        throw new Error("No scene " + name);
    };

    /**
     * Adds an asset to the asset register
     * @param asset
     */
    this.addAsset = function (asset) {
        this.assetManager.addAsset(asset);
    };

    /**
     * Attaches events to the current scene
     */
    this.attachEvents = function () {
        if (self.scenes[self.currentScene].keyPress) {
            document.addEventListener("keypress", self.scenes[self.currentScene].keyPress);
        }

        if (self.scenes[self.currentScene].click) {
            document.addEventListener("click", self.scenes[self.currentScene].click);
        }
    };

    /**
     * Removes events from current scene
     */
    this.detachEvents = function () {
        if (self.scenes[self.currentScene].keyPress) {
            document.removeEventListener("keypress", self.scenes[self.currentScene].keyPress);
        }

        if (self.scenes[self.currentScene].click) {
            document.removeEventListener("click", self.scenes[self.currentScene].click);
        }
    };

    /**
     * Runs the game loop after preloading the assets
     */
    this.runGameLoop = function () {
        self.assetManager.preloadAssets(function () {
            self.attachEvents();
            requestAnimationFrame(self.drawCurrentScene);
        });
    };

    /**
     * Draws the current scene to the canvas
     */
    this.drawCurrentScene = function () {
        self.screen.resize(canvas);
        self.scenes[self.currentScene].paint(canvas);

        if (isDebug && self.debug.slowPaint) {
            setTimeout(function () {
                requestAnimationFrame(self.drawCurrentScene);
            }, 1000);
        } else {
            requestAnimationFrame(self.drawCurrentScene);
        }
    };
}