function Asset() {
    this.name = '';
    this.src = null;
    this.type = null;
}

function ImageAsset(name, src) {
    this.name = name;
    this.src = src;
    this.type = 'image';
}

ImageAsset.prototype = new Asset();;function AssetManager() {
    this.assets = {};

    this.addAsset = function (asset) {
        this.assets[asset.name] = asset;
    };

    this.get = function (name) {
        return this.assets[name];
    };

    return this;
};function Element() {
    this.get = function () {
        throw new Error("Must overwrite this function");
    }
}

function ImageElement(assetName) {
    this.assetName = assetName;

    this.loadAsset = function (src) {
        this.image = new Image();
        this.image.src = src;

    };

    this.get = function () {
        return this.image;
    };

    this.resize = function () {

    };

    return this;
}

ImageElement.prototype = new Element();;function Engine(canvas, options, isDebug) {
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
};function AlpacaRun(canvas, isDebug) {
    var engine = new Engine(canvas, isDebug);

    // Register assets
    engine.addAsset(new ImageAsset('menu', '/img/splash.jpg'));

    // Setup menu scene
    var menuScene = engine.createScene('menu');
    menuScene.addElement(new ImageElement('menu'), 0, 0, '100%', '100%');
    engine.addScene(menuScene);

    return engine;
};function Position(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;

    return this;
};function Scene(engine, name) {
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

            debugger;

            this.engine.context.drawImage(
                element.get(), 0, 0, 800, 600
                /*element.position.top,
                 element.position.left,
                 width,
                 height*/
            );
        }
    };
};function Screen(canvas, options) {
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