function AssetManager() {
    var self = this;
    this.assets = {};

    this.addAsset = function (asset) {
        this.assets[asset.name] = asset;
    };

    this.get = function (name) {
        return this.assets[name];
    };

    /**
     * Loads assets into browser cache
     * @param callback
     */
    this.preloadAssets = function (callback) {
        async.forEachOf(this.assets, function (value, key, next) {
                switch (value.type) {
                    case 'image':
                        self.preloadImage(value, key, next);
                        break;
                }
            },
            function () {
                callback();
            }
        );
    };

    this.preloadImage = function (asset, key, next) {
        asset.image = new Image();
        asset.image.onload = function () {
            next();
        };
        asset.image.src = asset.src;
    };

    return this;
}