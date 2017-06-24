function AlpacaRun(canvas, isDebug) {
    var engine = new Engine(canvas, null, isDebug);

    // Register assets
    engine.addAsset(new ImageAsset('menu', '/img/splash.jpg'));

    // Shared assets
    engine.addAsset(new ImageAsset('alpaca', '/img/alpaca.png'));
    engine.addAsset(new ImageAsset('fence', '/img/fence.png'));
    engine.addAsset(new ImageAsset('apple', '/img/star.png'));

    // Level assets
    engine.addAsset(new ImageAsset('background', '/img/_11_background.png'));
    engine.addAsset(new ImageAsset('treesandbushes', '/img/_02_trees and bushes.png'));
    engine.addAsset(new ImageAsset('ground', '/img/_01_ground.png'));
    engine.addAsset(new ImageAsset('clouds', '/img/_08_clouds.png'));
    engine.addAsset(new ImageAsset('hugeclouds', '/img/_07_huge_clouds.png'));
    engine.addAsset(new ImageAsset('bushes', '/img/_04_bushes.png'));

    // Results screen
    engine.addAsset(new ImageAsset('results', '/img/results.jpg'));

    // Setup menu scene
    var menuScene = engine.createScene('menu');
    menuScene.addElement(new ImageElement('menu'), 0, 0, '100%', '100%');
    menuScene.addElement(new ImageElement('alpaca'), 300, 'center', 200, 200);
    menuScene.keypress = function (event) {
        if (event.keyCode === 32) {
            engine.changeScene('game');
        }
    };

    engine.addScene(menuScene);

    // Setup game scene
    var gameScene = engine.createScene('game');
    var background = gameScene.addElement(new ParallaxElement(new ImageElement('background')), 0, 0, '100%', '100%');
    var clouds = gameScene.addElement(new ParallaxElement(new ImageElement('clouds')), 0, 0, '100%', '100%');
    var hugeClouds = gameScene.addElement(new ParallaxElement(new ImageElement('hugeclouds')), 0, 0, '100%', '100%');
    var bushes = gameScene.addElement(new ParallaxElement(new ImageElement('bushes')), 0, 0, '100%', '100%');
    var trees = gameScene.addElement(new ParallaxElement(new ImageElement('treesandbushes')), 0, 0, '100%', '100%');
    var ground = gameScene.addElement(new ParallaxElement(new ImageElement('ground')), 0, 0, '100%', '100%');

    var backgroundGroup = gameScene.createAnimationGroup(background, clouds, hugeClouds, bushes, trees, ground);
    backgroundGroup.tick = function () {
        return new AnimationGroupAction(0, -1);
    };

    var alpacaElement = gameScene.addElement(new ImageElement('alpaca'), 400, 100, 100, 200);
    alpacaElement.direction = 'up';

    alpacaElement.tick = function () {
        if (this.position.top > 380 && this.direction === 'up') {
            this.position.top--;
            return;
        }

        if (this.position.top < 400 && this.direction === 'down') {
            this.position.top++;
            return;
        }

        if (this.position.top === 380) {
            this.direction = 'down';
            return;
        }

        if (this.position.top === 400) {
            this.direction = 'up';
            return;
        }
    };

    gameScene.keypress = function (event) {
        console.log(event.keyCode);
    };

    gameScene.addTick(20, alpacaElement);
    gameScene.addTick(20, backgroundGroup);

    engine.addScene(gameScene);

    return engine;
}