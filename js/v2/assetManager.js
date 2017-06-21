function AssetManager() {
    this.assets = {};

    this.addAsset = function (asset) {
        this.assets[asset.name] = asset;
    };

    this.get = function (name) {
        return this.assets[name];
    };

    this.preloadAssets = function () {
        console.log(this.assets);
    };

    return this;
}