function TaskRunner() {
    var t = this;

    var taskList = [];
    var timerList = [];

    t.add = function (ticks, run) {
        taskList.push({ticks: ticks, run: run});
    };

    t.run = function () {
        for (var i = 0; i < taskList.length; i++) {
            timerList.push(setInterval(taskList[i].run, taskList[i].ticks));
        }
    };

    t.stop = function () {
        for (var i = 0; i < timerList.length; i++) {
            clearInterval(timerList[i]);
        }

        timerList = [];
    };

    return t;
}