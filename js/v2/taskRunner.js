function TaskRunner() {
    var self = this;

    var taskList = [];
    var timerList = [];

    self.add = function (ticks, run) {
        taskList.push({ticks: ticks, run: run});
    };

    self.run = function () {
        for (var i = 0; i < taskList.length; i++) {
            timerList.push(setInterval(taskList[i].run, taskList[i].ticks));
        }
    };

    self.stop = function () {
        for (var i = 0; i < timerList.length; i++) {
            clearInterval(timerList[i]);
        }

        timerList = [];
    };

    return self;
}