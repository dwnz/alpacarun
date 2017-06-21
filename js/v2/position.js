function Position(top, left, width, height, allowScale) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.allowScale = allowScale === undefined ? true : allowScale;

    return this;
}