function AlpacaRun(canvas, isDebug) {
    var engine = new Engine(canvas, null, isDebug);

    // Register assets
    engine.addAsset(new ImageAsset('menu', '/img/splash.jpg'));
    engine.addAsset(new ImageAsset('alpaca', '/img/alpaca.png'));

    // Setup menu scene
    var menuScene = engine.createScene('menu');
    menuScene.addElement(new ImageElement('menu'), 0, 0, '100%', '100%');
    menuScene.addElement(new ImageElement('alpaca'), 'center', 'center', 200, 'auto');
    engine.addScene(menuScene);

    return engine;
}