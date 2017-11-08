const RunnerBase = require('../baseClasses/Runner');

class TimedIntervalRunner extends RunnerBase {
    start(){
        const self = this;
        self.timerInterval = setInterval(() => {
            const runnerData = {
                startTime: new Date()
            };
            self.testClassInstance.test().then((passData) => {
                runnerData.endTime = new Date();
                self.postTestResult(self.testClassInstance.instanceId, true, runnerData, passData);
            }).catch((failData) => {
                runnerData.endTime = new Date();
                self.postTestResult(self.testClassInstance.instanceId, false, runnerData, failData);
            });
        }, self.options.interval);
    }

    stop(){
        clearInterval(this.timerInterval);
    }

    static optionsSchema(){
        return {
            "type": "object",
            "properties": {
                "interval": {"type": "integer", "description": "Interval (ms)"}
            },
            "required": ["interval"]
        };
    }
}

module.exports = TimedIntervalRunner;
