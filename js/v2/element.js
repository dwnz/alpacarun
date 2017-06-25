function Element() {
    var self = this;

    this.get = function () {
        throw new Error("Must overwrite this function");
    };

    this.resize = function (engine) {
        if (!this.position) {
            throw new Error("Position must be an object");
        }
    };
}