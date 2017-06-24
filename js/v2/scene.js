function Scene(engine, name) {
    var self = this;

    this.engine = engine;
    this.name = name;

    this.elements = [];
    this.taskRunner = new TaskRunner();

    /**
     * Adds an element to the scene
     * @param element
     * @param top
     * @param left
     * @param width
     * @param height
     * @param allowScale
     * @returns {*}
     */
    this.addElement = function (element, top, left, width, height, allowScale) {
        element.position = new Position(top, left, width, height, allowScale, self.engine);
        element.asset = this.engine.assetManager.get(element.assetName);
        element.loadAsset(engine, element.asset.src);
        element.index = this.elements.length;

        this.elements.push(element);

        return element;
    };

    /**
     * Creates an animation group
     * @returns {AnimationGroup}
     */
    this.createAnimationGroup = function () {
        var group = new AnimationGroup(self.engine);

        for (var i = 0; i < arguments.length; i++) {
            group.addElement(arguments[i]);
        }

        return group;
    };

    /**
     * Called when scene ticks
     */
    this.tick = function () {
        for (var i = 0; i < self.elements.length; i++) {
            var element = self.elements[i];

            if (element.tick) {
                element.tick();
            }
        }
    };

    /**
     * Registers a tick against the scene
     * @param delay
     * @param element
     */
    this.addTick = function (delay, element) {
        this.taskRunner.add(delay, function () {
            var response = element.tick();

            if (element.type === 'group') {
                element.internalTick(response);
            }
        });
    };

    /**
     * Starts the scene, sets up things to do
     */
    this.play = function () {
        this.taskRunner.run();
    };

    /**
     * Tears down the scene once it's finished running
     */
    this.stop = function () {
        this.taskRunner.stop();
    };

    /**
     * Paints the scene to the canvas
     */
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