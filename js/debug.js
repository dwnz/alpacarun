function Debug(engine) {
    var self = this;
    this.engine = engine;

    self.run = function () {

    };

    self.FPS = function () {
        console.log(self.engine.paints);
        self.engine.paints = 0;
    };


    return self;
}