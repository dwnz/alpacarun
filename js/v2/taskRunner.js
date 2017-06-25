function TaskRunner() {
    var self = this;

    var isRunning = false;
    var taskList = [];
    var timerList = [];

    self.add = function (ticks, run) {
        taskList.push({ticks: ticks, run: run});

        if (isRunning) {
            timerList.push(setInterval(taskList[timerList.length].run, taskList[timerList.length].ticks));
        }
    };

    self.run = function () {
        isRunning = true;

        for (var i = 0; i < taskList.length; i++) {
            timerList.push(setInterval(taskList[i].run, taskList[i].ticks));
        }
    };

    self.stop = function () {
        for (var i = 0; i < timerList.length; i++) {
            clearInterval(timerList[i]);
        }

        isRunning = false;
        timerList = [];
    };

    return self;
}