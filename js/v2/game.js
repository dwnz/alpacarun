function AlpacaRun(canvas, isDebug) {
    var engine = new Engine(canvas, null, isDebug);

    // Register assets
    engine.addAsset(new ImageAsset('menu', '/img/splash.jpg'));

    engine.addAsset(new ImageAsset('alpaca', '/img/alpaca.png'));
    engine.addAsset(new ImageAsset('fence'));

    // Setup menu scene
    var menuScene = engine.createScene('menu');
    menuScene.addElement(new ImageElement('menu'), 0, 0, '100%', '100%');
    menuScene.addElement(new ImageElement('alpaca'), 300, 'center', 200, 'auto');
    menuScene.keypress = function (event) {
        if (event.keyCode === 32) {
            engine.changeScene('game');
        }
    };

    engine.addScene(menuScene);

    // Setup game scene
    var gameScene = engine.createScene('game');
    gameScene.keypress = function (event) {
        console.log(event.keyCode);
    };
    engine.addScene(gameScene);

    return engine;
}