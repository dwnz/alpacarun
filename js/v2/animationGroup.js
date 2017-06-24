function AnimationGroup(engine) {
    if (!engine) {
        throw new Error("Must create animation group from scene");
    }

    var self = this;

    this.type = 'group';
    this.engine = engine;
    this.elements = [];
    this.position = new Position(0, 0, '100%', '100%', false, this.engine);

    /**
     * Adds an element to the animation group
     * @param element
     */
    this.addElement = function (element) {
        this.elements.push(element);
    };

    /**
     * Animation group tick
     */
    this.internalTick = function (groupAction) {
        for (var i = 0; i < self.elements.length; i++) {
            self.elements[i].tick(groupAction);
        }
    };
}

function AnimationGroupAction(top, left) {
    this.top = top;
    this.left = left;
}