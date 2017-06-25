function AlpacaRun(canvas, isDebug) {
    var engine = new Engine(canvas, null, isDebug);

    // Register assets
    engine.addAsset(new ImageAsset('menu', '/img/splash.jpg'));

    // Shared assets
    engine.addAsset(new ImageAsset('alpaca', '/img/alpaca.png'));
    engine.addAsset(new ImageAsset('fence', '/img/fence.png'));
    engine.addAsset(new ImageAsset('apple', '/img/apple.png'));

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
    menuScene.keyPress = function (event) {
        if (event.keyCode === 32) {
            engine.changeScene('game');
        }
    };

    engine.addScene(menuScene);

    // Setup game scene
    var apples = [];
    var fences = [];
    var points = 0;

    var gameScene = engine.createScene('game');

    var background = gameScene.addElement(new ParallaxElement(new ImageElement('background')), 0, 0, '100%', '100%');
    var clouds = gameScene.addElement(new ParallaxElement(new ImageElement('clouds')), 0, 0, '100%', '100%');
    var hugeClouds = gameScene.addElement(new ParallaxElement(new ImageElement('hugeclouds')), 0, 0, '100%', '100%');
    var bushes = gameScene.addElement(new ParallaxElement(new ImageElement('bushes')), 0, 0, '100%', '100%');
    var trees = gameScene.addElement(new ParallaxElement(new ImageElement('treesandbushes')), 0, 0, '100%', '100%');
    var ground = gameScene.addElement(new ParallaxElement(new ImageElement('ground')), 0, 0, '100%', '100%');

    // Setup the background group
    var backgroundGroup = gameScene.createAnimationGroup(background, hugeClouds, bushes, trees, ground);
    backgroundGroup.tick = function () {
        return new AnimationGroupAction(0, -1);
    };

    clouds.tick = function () {
        this.position.left--;
    };

    // Setup the alpaca
    var alpacaElement = gameScene.addElement(new ImageElement('alpaca'), 400, 100, 100, 100);
    alpacaElement.direction = 'up';

    alpacaElement.tick = function () {
        if (this.position.top > 370 && this.direction === 'up') {
            this.position.top--;
            return;
        }

        if (this.position.top < 400 && this.direction === 'down') {
            this.position.top++;
            return;
        }

        if (this.position.top === 370) {
            this.direction = 'down';
            return;
        }

        if (this.position.top === 400) {
            this.direction = 'up';
            return;
        }
    };

    var pointsElement = gameScene.addElement(new TextElement("Points: " + points, 30, 'Arial'), 10, 10, 500, 200);

    gameScene.keyPress = function (event) {
        switch (event.keyCode) {
            case 32:
                alpacaElement.jump(200, 4);
                break;
        }
    };

    gameScene.addTick(500, function AddApples() {
        var shouldAdd = Math.random() * (1000 - 100 ) + 100;

        if (shouldAdd > 500) {
            var yPosition = Math.random() * (470 - 250 ) + 250;

            var apple = gameScene.createElement(new ImageElement('apple'), yPosition, '100%', 32, 32);
            apple.onCollision = function () {
                gameScene.removeElement(this);
            };
            apples.push(apple);

            gameScene.watchForCollision(apple, alpacaElement);
            gameScene.addElement(apple);
        }

        for (var i = 0; i < apples.length; i++) {
            if (apples[i].position.left < -32) {
                gameScene.removeElement(apples[i]);
            }
        }
    });

    gameScene.addTick(10, function () {
        for (var i = 0; i < apples.length; i++) {
            apples[i].position.left--;
        }

        for (var i = 0; i < fences.length; i++) {
            fences[i].position.left--;
        }
    });

    gameScene.addTick(3000, function () {
        var shouldAdd = Math.random() * (1000 - 100 ) + 100;

        if (shouldAdd > 500) {
            var fence = gameScene.createElement(new ImageElement('fence'), 440, '100%', 16, 100);
            fence.onCollision = function () {
                engine.changeScene('results');
            };
            fences.push(fence);

            gameScene.watchForCollision(fence, alpacaElement);
            gameScene.addElement(fence);
        }
    });

    gameScene.onStop = function () {
        apples = [];
        fences = [];
    };

    gameScene.addTick(10, alpacaElement);
    gameScene.addTick(50, clouds);
    gameScene.addTick(10, backgroundGroup);

    engine.addScene(gameScene);


    var resultsScene = engine.createScene('results');
    resultsScene.keyPress = function () {
        engine.changeScene('game');
    };
    resultsScene.engine.addScene(resultsScene);

    return engine;
}