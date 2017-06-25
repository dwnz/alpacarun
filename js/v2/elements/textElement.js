function TextElement(text, size, font) {
    this.text = text;
    this.size = size;
    this.font = font;

    this.get = function () {
        var canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;

        var ctx = canvas.getContext('2d');

        ctx.font = this.size + "px " + this.font;
        ctx.fillText(text, 0, 0);

        return canvas;
    };
}

TextElement.prototype = new Element();