function JumpAction(maxJumpHeight, speed) {
    var self = this;

    if (!self.isActionRunning) {
        self.original = {
            top: this.position.top
        };
    }

    this.isActionRunning = false;
    this.speed = speed;
    this.startJumpAt = self.original.top;
    this.endJumpAt = self.original.top - maxJumpHeight;
    this.jumpDirection = 'up';

    this.actionTick = function () {
        self.isActionRunning = true;

        if (this.position.top >= self.endJumpAt && this.jumpDirection === 'up') {
            this.position.top = this.position.top - this.speed;
        }

        if (this.position.top === this.endJumpAt && this.jumpDirection === 'up') {
            this.jumpDirection = 'down';
            return;
        }

        if (this.position.top <= this.startJumpAt && this.jumpDirection === 'down') {
            this.position.top = this.position.top + this.speed;
        }

        if (this.position.top === this.startJumpAt && this.jumpDirection === 'down') {
            this.jumpDirection = 'up';
            self.end();
        }
    };

    this.end = function () {
        this.actionTick = null;
        self.isActionRunning = false;
    }
}

Element.prototype.jump = JumpAction;