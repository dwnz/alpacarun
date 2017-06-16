function AlpacaRun(canvas, isDebug) {
    var engine = new Engine(canvas, isDebug);

    // Register assets
    engine.addAsset(new ImageAsset('menu', '/img/splash.jpg'));

    // Setup menu scene
    var menuScene = engine.createScene('menu');
    menuScene.addElement(new ImageElement('menu'), 0, 0, '100%', '100%');
    engine.addScene(menuScene);

    return engine;
}