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

ImageAsset.prototype = new Asset();