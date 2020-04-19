// TODO: Massive refactor...

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

function AlpacaRun(canvas, isDebug) {
    var t = this;
    t.isRunning = false;
    t.playSound = true;
    t.hasLocalStorage = false;
    t.paints = 0;

    var ctx = canvas.getContext("2d");
    var uiHelper = new UIHelper(canvas);
    var taskRunner = new TaskRunner();
    var debug;

    // Display variables
    var canvasWidth;
    var canvasHeight;
    var scale = 1;
    var heightScale;

    // Game properties
    var gameLength = 30;
    var maxJumpHeight = 200 * scale;
    var isJumping = false;
    var points = 0;
    var secondsLeft = gameLength;
    var level = 0.4;
    var stars = [];
    var fences = [];
    var starIndex = 0;
    var fenceIndex = 0;
    var addStarsTimeout;
    var addFencesTimeout;
    var starsGenerated = 0;
    var highScore = 0;

    // Asset holders
    var img, trees, ground, clouds, clouds2, bushes, alpaca, star, results, splash, ding, fence, song;
    var assetCount = 11;
    var assetsLoaded = 0;

    // Keep track of positions
    var position = {
        clouds1: 0,
        clouds2: 0,
        clouds3: 0,
        clouds4: 0,

        ground1: 0,
        ground2: 0,

        bushes1: 0,
        bushes2: 0,

        alpaca: 0,
        alpacaDirection: 'up',
        alpacaWidth: 0,
        alpacaHeight: 0
    };

    t.init = function () {
        var loadingScreen = setInterval(function () {
            requestAnimationFrame(function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "30px Arial";
                ctx.fillStyle = 'white';
                ctx.fillText(
                    Math.round((assetsLoaded / assetCount) * 100) + "%",
                    (canvasWidth / 2) - (48 / 2),
                    (canvasHeight / 2) - (48 / 2)
                );
                ctx.fillStyle = 'black';
            });
        }, 1000);

        async.waterfall(
            [
                function (next) {
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

                    maxJumpHeight = Math.floor(200 * scale);

                    next();
                },
                function (next) {
                    position.clouds1 = 0;
                    position.clouds2 = canvasWidth;
                    position.clouds3 = 0;
                    position.clouds4 = canvasWidth;

                    position.ground1 = 0;
                    position.ground2 = canvasWidth;

                    position.bushes1 = 0;
                    position.bushes2 = canvasWidth;

                    position.alpaca = 0;
                    position.alpacaDirection = 'up';

                    position.alpacaWidth = Math.floor(90 * scale);
                    position.alpacaHeight = Math.floor(100 * scale);

                    next();
                },
                function (next) {
                    uiHelper.LoadImage('_11_background.png', function (image) {
                        img = image;
                        assetsLoaded++;
                        next();
                    });
                },
                function (next) {
                    uiHelper.LoadImage('splash.jpg', function (image) {
                        splash = image;
                        assetsLoaded++;
                        next();
                    });
                },
                function (next) {
                    uiHelper.LoadImage('_02_trees and bushes.png', function (image) {
                        trees = image;
                        assetsLoaded++;
                        next();
                    })
                },
                function (next) {
                    uiHelper.LoadImage('_01_ground.png', function (image) {
                        ground = image;
                        assetsLoaded++;
                        next();
                    })
                },
                function (next) {
                    uiHelper.LoadImage('_08_clouds.png', function (image) {
                        clouds = image;
                        next();
                    })
                },
                function (next) {
                    uiHelper.LoadImage('_07_huge_clouds.png', function (image) {
                        clouds2 = image;
                        assetsLoaded++;
                        next();
                    });
                },
                function (next) {
                    uiHelper.LoadImage('_04_bushes.png', function (image) {
                        bushes = image;
                        assetsLoaded++;
                        next();
                    });
                },
                function (next) {
                    uiHelper.LoadImage('alpaca.png', function (image) {
                        alpaca = image;
                        assetsLoaded++;
                        next();
                    })
                },
                function (next) {
                    uiHelper.LoadImage('apple.png', function (image) {
                        star = image;
                        assetsLoaded++;
                        next();
                    })
                },
                function (next) {
                    uiHelper.LoadImage('fence.png', function (image) {
                        fence = image;
                        assetsLoaded++;
                        next();
                    })
                },
                function (next) {
                    uiHelper.LoadImage('results.jpg', function (image) {
                        results = image;
                        assetsLoaded++;
                        next();
                    })
                },

                function (next) {
                    if (Audio) {
                        ding = new Audio('/sound/ding.wav');
                        ding.isSetup = false;

                        song = new Audio('/sound/music.wav')

                        var timeout = setTimeout(function () {
                            // Something went wrong...
                            ding = {
                                play: function () {
                                }
                            };
                            assetsLoaded++;
                            next();
                        }, 1500);

                        // Hack to make sure we don't load audio more than once
                        ding.addEventListener('canplaythrough', function () {
                            if (!ding.isSetup) {
                                assetsLoaded++;
                                ding.isSetup = true;
                                clearTimeout(timeout);
                                next();
                            }
                        });
                    } else {
                        ding = {
                            play: function () {
                            }
                        };
                        assetsLoaded++;
                        next();
                    }
                },

                function (next) {
                    var hammertime = new Hammer(canvas);
                    hammertime.on('tap', function () {
                        if (!t.isRunning) {
                            t.start();
                            return;
                        }

                        position.alpacaDirection = 'up';
                        isJumping = true;
                    });

                    next();
                },

                function (next) {
                    if (localStorage && localStorage.getItem) {
                        t.hasLocalStorage = true;
                    }

                    next();
                },

                function (next) {
                    if (t.hasLocalStorage) {
                        if (localStorage.getItem("highscore")) {
                            highScore = parseInt(localStorage.getItem("highscore"));
                        }
                    }

                    next();
                }
            ],
            function () {
                clearInterval(loadingScreen);
                t.menu();
            }
        );
    };

    if (isDebug) {
        debug = new Debug(this);
        debug.run();
    }

    this.start = function () {
        this.reset();
        this.isRunning = true;
        song.loop = true;
        song.play();

        for (var i = 0; i < Math.random() * (10 - 2) + 2; i++) {
            var yPosition = Math.random() * ((470 * heightScale) - (250 * heightScale)) + (250 * heightScale);
            var xPosition = Math.random() * (800 - 200 ) + 200;

            stars.push({
                x: Math.floor(xPosition * scale),
                y: yPosition,
                i: starIndex,
                clean: true,
                h: Math.floor(32 * scale),
                w: Math.floor(32 * scale)
            });
            starIndex++;
        }

        taskRunner.run();

        requestAnimationFrame(Draw);

        addStarsTimeout = setTimeout(AddStarsIfNeeded, 100);
        addFencesTimeout = setTimeout(AddFencesRandomly, 100);
    };

    this.reset = function () {
        secondsLeft = gameLength;
        stars = [];
        fences = [];
        starIndex = 0;
        level = 0.4;
        points = 0;
        starsGenerated = 0;
        position.alpaca = 0;
        position.alpacaDirection = 'up';
    };

    // Gross resize function... Need to refactor
    this.resize = function () {
        t.isRunning = false;
        clearTimeout(addStarsTimeout);
        clearTimeout(addFencesTimeout);
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

        position.alpacaWidth = Math.floor(90 * scale);
        position.alpacaHeight = Math.floor(100 * scale);

        // Rebuild sizing across images
        uiHelper.LoadAndSizeImage(img);
        uiHelper.LoadAndSizeImage(trees);
        uiHelper.LoadAndSizeImage(ground);
        uiHelper.LoadAndSizeImage(clouds);
        uiHelper.LoadAndSizeImage(clouds2);
        uiHelper.LoadAndSizeImage(bushes);
        uiHelper.LoadAndSizeImage(alpaca);
        uiHelper.LoadAndSizeImage(star);

        position.clouds1 = 0;
        position.clouds2 = canvasWidth;
        position.clouds3 = 0;
        position.clouds4 = canvasWidth;

        position.ground1 = 0;
        position.ground2 = canvasWidth;

        position.bushes1 = 0;
        position.bushes2 = canvasWidth;

        position.alpaca = 0;
        position.alpacaDirection = 'up';

        if (t.menu) {
            uiHelper = new UIHelper(canvas);
            t.menu();
        }
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

    // Load tasks
    taskRunner.add(5, AlpacaJump);
    taskRunner.add(20, MoveClouds);
    taskRunner.add(40, MoveForegroundClouds);
    taskRunner.add(60, MoveBushes);
    taskRunner.add(10, MoveBackground);
    taskRunner.add(10, DetectCollision);
    taskRunner.add(50, MoveAlpaca);
    taskRunner.add(2, MoveStars);
    taskRunner.add(2, MoveFences);
    taskRunner.add(1000, Countdown);
    taskRunner.add(3000, ChangeLevel);

    if (isDebug) {
        taskRunner.add(1000, debug.FPS);
    }

    // Menu "scene"
    t.menu = function () {
        window.addEventListener('orientationchange', t.resize);
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

    // Results "scene"
    t.drawResults = function () {
        if (points > highScore) {
            highScore = points;
            if (t.hasLocalStorage) {
                localStorage.setItem("highscore", highScore);
            }
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(results, 0, 0, canvasWidth, canvasHeight);

        var appleWidth = 32 * scale;
        var appleHeight = 32 * heightScale;

        ctx.drawImage(
            star,
            (canvasWidth / 2) - ((appleWidth / 2) + (76 * scale)),
            (canvasHeight / 2) - (appleHeight / 2) - (72 * heightScale),
            appleWidth,
            appleHeight
        );

        ctx.fillText(
            points + " out of " + Math.floor(starIndex - stars.length),
            (canvasWidth / 2) - (appleWidth / 2) - (28 * scale),
            (canvasHeight / 2) - (appleHeight / 2) - (44 * heightScale)
        );

        ctx.fillText(
            "Personal best: " + highScore,
            (canvasWidth / 2) - (110 * scale),
            (canvasHeight / 2)
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
            ding.play();
        }
    }

    function AddStarsIfNeeded() {
        var toAdd = Math.random() * (3 - 1) + 1;
        var toWait = Math.random() * ((5000 - 2000) + 2000);

        for (var i = 0; i < toAdd; i++) {
            var yPosition = Math.random() * ((470 * heightScale) - (250 * heightScale)) + (250 * heightScale);
            var xPosition = Math.random() * (1000 - 800 ) + 800;

            stars.push({
                x: Math.floor(xPosition * scale),
                y: yPosition,
                i: starIndex,
                clean: true,
                h: Math.floor(32 * scale),
                w: Math.floor(32 * scale)
            });

            starIndex++;
        }

        addStarsTimeout = setTimeout(AddStarsIfNeeded, toWait);
    }

    function AddFencesRandomly() {
        var toWait = Math.random() * ((3000 - 1000) + 1000);

        if (fences.length === 0 || fences[fences.length - 1].x <= 0) {
            var yPosition = canvas.height - (150 * heightScale);
            var xPosition = Math.random() * (1000 - 800 ) + 800;

            fences.push({
                x: Math.floor(xPosition * scale),
                y: yPosition,
                i: fenceIndex,
                clean: true,
                h: Math.floor(32 * scale),
                w: Math.floor(32 * scale)
            });

            fences.push({
                x: Math.floor(xPosition * scale),
                y: yPosition - (32 * scale),
                i: fenceIndex,
                clean: true,
                h: Math.floor(32 * scale),
                w: Math.floor(32 * scale)
            });

            fences.push({
                x: Math.floor(xPosition * scale),
                y: yPosition + (32 * scale),
                i: fenceIndex,
                clean: true,
                h: Math.floor(32 * scale),
                w: Math.floor(32 * scale)
            });

            fenceIndex++;
        }

        addFencesTimeout = setTimeout(AddFencesRandomly, toWait);

    }

    function ChangeLevel() {
        level = level + 0.1;
    }

    function DetectCollision() {
        var fenceHits = fences.filter(function (item) {
            return item.x > Math.floor(160 * scale)
                &&
                item.x < Math.floor(260 * scale)
                &&
                item.y > Math.floor((400 * heightScale) - position.alpaca)
                &&
                item.y < Math.floor((400 * heightScale) - position.alpaca) + Math.floor(100 * heightScale)
                &&
                item.clean
        });

        if (fenceHits.length > 0) {
            for (var i = 0; i < fenceHits.length; i++) {
                for (var x = 0; x < fences.length; x++) {
                    if (fenceHits[i].i === fences[x].i) {
                        t.isRunning = false;
                        clearTimeout(addStarsTimeout);
                        taskRunner.stop();

                        setTimeout(function () {
                            t.drawResults();
                        }, 50);
                    }
                }
            }

            AddPoint();
        }

        var alpacaStars = stars.filter(function (item) {
            return item.x > Math.floor(160 * scale)
                &&
                item.x < Math.floor(260 * scale)
                &&
                item.y > Math.floor((400 * heightScale) - position.alpaca)
                &&
                item.y < Math.floor((400 * heightScale) - position.alpaca) + Math.floor(100 * heightScale)
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

    function MoveStars() {
        for (var i = 0; i < stars.length; i++) {
            if (stars[i].x < -32) {
                stars.splice(i, 1);
                return;
            }

            stars[i].x = stars[i].x - 1;
        }
    }

    function MoveFences() {
        for (var i = 0; i < fences.length; i++) {
            if (fences[i].x < -32) {
                continue;
            }

            fences[i].x = fences[i].x - 1;
        }
    }

    function Draw() {
        if (t.isRunning) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, canvasWidth, 0, canvasWidth, canvasHeight);

            ctx.drawImage(clouds, position.clouds1, Math.floor(10 * scale), clouds.cWidth, clouds.cHeight);
            ctx.drawImage(clouds, position.clouds2, Math.floor(10 * scale), clouds.cWidth, clouds.cHeight);

            ctx.drawImage(clouds2, position.clouds3, 0, canvasWidth, clouds2.cHeight);
            ctx.drawImage(clouds2, position.clouds4, 0, canvasWidth, clouds2.cHeight);

            ctx.drawImage(bushes, position.bushes1, 0, canvasWidth, bushes.cHeight);
            ctx.drawImage(bushes, position.bushes2, 0, canvasWidth, bushes.cHeight);

            ctx.drawImage(trees, position.ground1, 0, canvasWidth, trees.cHeight);
            ctx.drawImage(trees, position.ground2, 0, canvasWidth, trees.cHeight);

            ctx.drawImage(ground, position.ground1, 0, canvasWidth, trees.cHeight);
            ctx.drawImage(ground, position.ground2, 0, canvasWidth, trees.cHeight);

            for (var i = 0; i < stars.length; i++) {
                ctx.drawImage(star, stars[i].x, stars[i].y, stars[i].w, stars[i].h);
            }

            ctx.drawImage(alpaca, Math.floor(160 * scale), Math.floor(((400 * scale) - position.alpaca) * scale), position.alpacaWidth, position.alpacaHeight);

            for (var i = 0; i < fences.length; i++) {
                ctx.drawImage(fence, fences[i].x, fences[i].y, fences[i].w, fences[i].h);
            }

            ctx.font = "30px Arial";
            ctx.fillText("Apples: " + points, 10, 30);
            ctx.fillText(secondsLeft + " seconds left", canvasWidth - 210, 30);
            t.paints++;

            requestAnimationFrame(Draw);
        }
    }
}