function Scene(engine, name) {
    var self = this;

    this.engine = engine;
    this.name = name;

    this.elements = [];
    this.elementIndex = 0;
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
        if (arguments.length > 1) {
            this.elements.push(this.createElement(element, top, left, width, height, allowScale));
        }
        else {
            this.elements.push(element);
        }

        return element;
    };

    /**
     * Removes an element from the screen
     * @param element
     */
    this.removeElement = function (element) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].index === element.index) {
                this.elements.splice(i, 1);
            }
        }
    };

    /**
     * Creates a new display element
     * @param element
     * @param top
     * @param left
     * @param width
     * @param height
     * @param allowScale
     * @returns {*}
     */
    this.createElement = function (element, top, left, width, height, allowScale) {
        element.position = new Position(top, left, width, height, allowScale, self.engine);
        element.asset = this.engine.assetManager.get(element.assetName);

        if (element.asset) {
            element.loadAsset(engine, element.asset.src);
        }

        element.index = this.elementIndex;
        this.elementIndex++;

        return element;
    };

    /**
     * Watches for a collision between two objects
     * @param from
     * @param to
     */
    this.watchForCollision = function (from, to) {
        this.addTick(50, function () {
            if (
                from.position.left < to.position.right()
                &&
                from.position.right() > to.position.left
                &&
                from.position.top < to.position.bottom()
                &&
                from.position.bottom() > to.position.top
                &&
                !from.hasMet
            ) {
                from.hasMet = true;
                from.onCollision();
            }
        });
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
            if ((typeof element) === "function") {
                return element();
            }

            if (element.actionTick) {
                element.actionTick();
            } else {
                var response = element.tick();

                if (element.type === 'group') {
                    element.internalTick(response);
                }
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
        if (this.onStop) {
            this.onStop();
        }
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