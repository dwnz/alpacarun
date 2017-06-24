function Debug(engine) {
    var self = this;
    this.engine = engine;

    this.slowPaint = false;

    this.log = function () {
        console.log(arguments);
    };

    this.dumpEngine = function () {
        console.log(this.engine);
    };

    this.assetBoxes = function () {
        console.log(this.engine.assetManager.assets);
    };
}