// TODO: Massive refactor...

function AlpacaRun(canvas, isDebug) {
    var t = this;
    t.isRunning = false;
    t.playSound = true;

    var ctx = canvas.getContext("2d");

    // Display variables
    var canvasWidth;
    var canvasHeight;
    var scale;
    var heightScale;

    var fps = 500;
    var gameLength = 30;

    // Setup task runner to build game UI
    var taskRunner = new TaskRunner();
    var uiHelper = new UIHelper(canvas);
    var addStarsTimeout;

    if (isDebug) {
        var debug = new Debug();
        debug.run();
    }

    this.start = function () {
        this.reset();
        this.isRunning = true;
        taskRunner.run();
        addStarsTimeout = setTimeout(AddStarsIfNeeded, 1000);
    };

    this.reset = function () {
        secondsLeft = gameLength;
        stars = [];
        starIndex = 0;
        level = 0.4;
        points = 0;
    };

    // Gross resize function... Need to refactor
    this.resize = function () {
        t.isRunning = false;
        clearTimeout(addStarsTimeout);
        taskRunner.stop();

        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;

        if (canvasWidth > 800) {
            canvasWidth = 800;
            canvasHeight = 600;
        }

        scale = canvasWidth / 800;
        heightScale = canvasHeight / 600;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (t.menu) {
            uiHelper = new UIHelper(canvas);
            t.menu();

            // Rebuild sizing across images
            uiHelper.LoadAndSizeImage(img);
            uiHelper.LoadAndSizeImage(trees);
            uiHelper.LoadAndSizeImage(ground);
            uiHelper.LoadAndSizeImage(clouds);
            uiHelper.LoadAndSizeImage(clouds2);
            uiHelper.LoadAndSizeImage(bushes);
            uiHelper.LoadAndSizeImage(alpaca);
            uiHelper.LoadAndSizeImage(star);

            position = {
                clouds1: 0,
                clouds2: canvasWidth,
                clouds3: 0,
                clouds4: canvasWidth,

                ground1: 0,
                ground2: canvasWidth,

                bushes1: 0,
                bushes2: canvasWidth,

                alpaca: 0,
                alpacaDirection: 'up'
            };
        }
    };

    // Setup core display
    t.resize();

    // Game properties
    var maxJumpHeight = 200 * scale;
    var isJumping = false;
    var points = 0;
    var secondsLeft = gameLength;
    var level = 0.4;
    var stars = [];
    var starIndex = 0;

    t.reset();

    // Keep track of positions
    var position = {
        clouds1: 0,
        clouds2: canvasWidth,
        clouds3: 0,
        clouds4: canvasWidth,

        ground1: 0,
        ground2: canvasWidth,

        bushes1: 0,
        bushes2: canvasWidth,

        alpaca: 0,
        alpacaDirection: 'up'
    };

    // Attach keypress event
    document.addEventListener("keypress", function (event) {
        switch (event.charCode) {
            case 32:
                if (!t.isRunning) {
                    t.start();
                    return;
                }

                position.alpacaDirection = 'up';
                isJumping = true;
                break;
        }
    });

    canvas.addEventListener('click', function () {
        if (!t.isRunning) {
            t.start();
            return;
        }

        position.alpacaDirection = 'up';
        isJumping = true;
    });

    // Load assets
    var img = new Image();
    img.onload = uiHelper.LoadAndSizeImage;
    img.src = '/img/_11_background.png';

    var trees = new Image();
    trees.onload = uiHelper.LoadAndSizeImage;
    trees.src = '/img/_02_trees and bushes.png';

    var ground = new Image();
    ground.onload = uiHelper.LoadAndSizeImage;
    ground.src = '/img/_01_ground.png';

    var clouds = new Image();
    clouds.onload = uiHelper.LoadAndSizeImage;
    clouds.src = '/img/_08_clouds.png';

    var clouds2 = new Image();
    clouds2.onload = uiHelper.LoadAndSizeImage;
    clouds2.src = '/img/_07_huge_clouds.png';

    var bushes = new Image();
    bushes.onload = uiHelper.LoadAndSizeImage;
    bushes.src = '/img/_04_bushes.png';

    var alpaca = new Image();
    alpaca.onload = uiHelper.LoadAndSizeImage;
    alpaca.src = '/img/alpaca.png';

    var star = new Image();
    star.onload = uiHelper.LoadAndSizeImage;
    star.src = '/img/apple.png';

    var results = new Image();
    results.onload = uiHelper.LoadAndSizeImage;
    results.src = '/img/results.jpg';

    // Check that the browser supports audio
    var ding;
    if (Audio) {
        ding = new Audio('/sound/ding.wav');
    } else {
        ding = {
            play: function () {
            }
        };
    }

    /* if (Audio && t.playSound) {
     var backgroundAudio = new Audio('/sound/music.wav');
     backgroundAudio.loop = true;
     backgroundAudio.play();
     }*/

    // Load tasks
    taskRunner.add(1000 / fps, Draw);
    taskRunner.add(5, AlpacaJump);
    taskRunner.add(20, MoveClouds);
    taskRunner.add(40, MoveForegroundClouds);
    taskRunner.add(60, MoveBushes);
    taskRunner.add(10, MoveBackground);
    taskRunner.add(10, DetectCollision);
    taskRunner.add(50, MoveAlpaca);
    taskRunner.add(1000, Countdown);
    taskRunner.add(3000, ChangeLevel);

    // Menu "scene"
    t.menu = function () {
        window.addEventListener('orientationchange', t.resize);

        var splash = new Image();
        splash.onload = function () {
            ctx.drawImage(splash, 0, 0, canvasWidth, canvasHeight);

            var alpacaWidth = (alpaca.cWidth / 2) * scale;
            var alpacaHeight = (alpaca.cHeight / 2) * heightScale;

            ctx.drawImage(
                alpaca,
                (canvasWidth / 2) - (alpacaWidth / 2),
                (canvasHeight / 2) - (alpacaHeight / 3),
                alpacaWidth,
                alpacaHeight
            );
        };
        splash.src = '/img/splash.jpg';
    };

    // Results "scene"
    t.drawResults = function () {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(results, 0, 0, canvasWidth, canvasHeight);

        var appleWidth = 32 * scale;
        var appleHeight = 32 * heightScale;

        ctx.drawImage(
            star,
            (canvasWidth / 2) - ((appleWidth / 2) + (48 * scale)),
            (canvasHeight / 2) - (appleHeight / 2),
            appleWidth,
            appleHeight
        );

        ctx.fillText(
            points,
            (canvasWidth / 2) - (appleWidth / 2),
            (canvasHeight / 2) - (appleHeight / 2) + (28 * scale)
        );

        ctx.fillText(
            "Click/tap to go again",
            (canvasWidth / 2) - (130 * scale),
            canvasHeight - (50 * scale)
        )
    };

    // CODEZ
    function AlpacaJump() {
        if (isJumping) {
            if (position.alpacaDirection === 'up' && position.alpaca < maxJumpHeight) {
                position.alpaca = position.alpaca + 2;
                return;
            }

            if (position.alpacaDirection === 'up' && position.alpaca >= maxJumpHeight) {
                position.alpacaDirection = 'down';
                return;
            }

            if (position.alpacaDirection === 'down' && position.alpaca > 0) {
                position.alpaca = position.alpaca - 2;
                return;
            }

            if (position.alpacaDirection === 'down' && position.alpaca <= 0) {
                position.alpacaDirection = 'up';
                isJumping = false;
                return;
            }
        }
    }

    function MoveClouds() {
        if (position.clouds1 <= -canvasWidth) {
            position.clouds1 = canvasWidth;
        } else {
            position.clouds1--;
        }

        if (position.clouds2 <= -canvasWidth) {
            position.clouds2 = canvasWidth;
        } else {
            position.clouds2--;
        }
    }

    function MoveForegroundClouds() {
        if (position.clouds3 <= -canvasWidth) {
            position.clouds3 = canvasWidth;
        } else {
            position.clouds3--;
        }

        if (position.clouds4 <= -canvasWidth) {
            position.clouds4 = canvasWidth;
        } else {
            position.clouds4--;
        }
    }

    function MoveBushes() {
        if (position.bushes1 <= -canvasWidth) {
            position.bushes1 = canvasWidth;
        } else {
            position.bushes1--;
        }

        if (position.bushes2 <= -canvasWidth) {
            position.bushes2 = canvasWidth;
        } else {
            position.bushes2--;
        }
    }

    function MoveBackground() {
        if (position.ground1 <= -(canvasWidth - (10 * scale))) {
            position.ground1 = canvasWidth - (10 * scale);
        } else {
            position.ground1--;
        }

        if (position.ground2 <= -(canvasWidth - (10 * scale))) {
            position.ground2 = canvasWidth - (10 * scale);
        } else {
            position.ground2--;
        }
    }

    function MoveAlpaca() {
        if (isJumping) {
            return;
        }

        if (position.alpaca < (20 ) && position.alpacaDirection === 'up') {
            position.alpaca++;
            return;
        }

        if (position.alpaca > 0 && position.alpacaDirection === 'down') {
            position.alpaca--;
            return;
        }

        if (position.alpaca === (20)) {
            position.alpacaDirection = 'down';
            return;
        }

        if (position.alpaca === 0) {
            position.alpacaDirection = 'up';
            return;
        }
    }

    function AddPoint() {
        points++;

        if (Audio && t.playSound) {
            var dinger = new Audio('/sound/ding.wav');
            dinger.play();
        }
    }

    function AddStarsIfNeeded() {
        var toAdd = Math.random() * (3 - 1) + 1;
        var toWait = Math.random() * ((5000 - 2000) + 2000);

        for (var i = 0; i < toAdd; i++) {
            var yPosition = Math.random() * ((470 * heightScale) - (250 * heightScale)) + (250 * heightScale);
            var xPosition = Math.random() * (1000 - 800 ) + 800;

            stars.push({x: xPosition, y: yPosition, i: starIndex, clean: true});
            starIndex++;
        }

        addStarsTimeout = setTimeout(AddStarsIfNeeded, toWait);
    }

    function ChangeLevel() {
        level = level + 0.1;
    }

    function DetectCollision() {
        var alpacaStars = stars.filter(function (item) {
            return item.x > (160 * scale)
                &&
                item.x < (260 * scale)
                &&
                item.y > ((400 * heightScale) - position.alpaca)
                &&
                item.y < ((400 * heightScale) - position.alpaca ) + (100 * heightScale)
                &&
                item.clean
        });

        if (alpacaStars.length > 0) {
            for (var i = 0; i < alpacaStars.length; i++) {
                for (var x = 0; x < stars.length; x++) {
                    if (alpacaStars[i].i === stars[x].i) {
                        stars.splice(x, 1);
                    }
                }
            }

            AddPoint();
        }
    }

    function Countdown() {
        secondsLeft--;

        if (secondsLeft === 0) {
            t.isRunning = false;
            clearTimeout(addStarsTimeout);
            taskRunner.stop();

            setTimeout(function () {
                t.drawResults();
            }, 50);
        }
    }

    function Draw() {
        if (t.isRunning) {
            window.requestAnimationFrame(function (p1) {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(img, canvasWidth, 0, canvasWidth, canvasHeight);

                ctx.drawImage(clouds, position.clouds1, (10 * scale), clouds.cWidth, clouds.cHeight);
                ctx.drawImage(clouds, position.clouds2, (10 * scale), clouds.cWidth, clouds.cHeight);

                ctx.drawImage(clouds2, position.clouds3, 0, canvasWidth, clouds2.cHeight);
                ctx.drawImage(clouds2, position.clouds4, 0, canvasWidth, clouds2.cHeight);

                ctx.drawImage(bushes, position.bushes1, 0, canvasWidth, bushes.cHeight);
                ctx.drawImage(bushes, position.bushes2, 0, canvasWidth, bushes.cHeight);

                ctx.drawImage(trees, position.ground1, 0, canvasWidth, trees.cHeight);
                ctx.drawImage(trees, position.ground2, 0, canvasWidth, trees.cHeight);

                ctx.drawImage(ground, position.ground1, 0, canvasWidth, trees.cHeight);
                ctx.drawImage(ground, position.ground2, 0, canvasWidth, trees.cHeight);

                for (var i = 0; i < stars.length; i++) {
                    if (stars[i].x < -32) {
                        stars.splice(i, 1);
                        return;
                    }

                    ctx.drawImage(star, stars[i].x, stars[i].y, (32 * scale), (32 * scale));
                    stars[i].x = stars[i].x - level;
                }

                ctx.drawImage(alpaca, 160 * scale, ((400 * scale) - position.alpaca) * scale, 90 * scale, 100 * scale);

                ctx.font = "30px Arial";
                ctx.fillText("Apples: " + points, 10, 30);
                ctx.fillText(secondsLeft + " seconds left", canvasWidth - 210, 30);
            })
        }
    }
}