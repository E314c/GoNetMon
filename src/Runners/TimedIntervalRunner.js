const RunnerBase = require('../baseClasses/Runner');

class TimedIntervalRunner extends RunnerBase {
    start(){
        const self = this;

        // Create interval
        self.timerInterval = setInterval(() => {

            // Run each assigned testInstance:
            self.testClassInstances.forEach(testClassInstance => {
                const runnerData = {
                    startTime: new Date()
                };
                // Run test:
                testClassInstance.test().then((passData) => {
                    runnerData.endTime = new Date();
                    self.postTestResult(testClassInstance.instanceId, true, runnerData, passData);
                }).catch((failData) => {
                    runnerData.endTime = new Date();
                    self.postTestResult(testClassInstance.instanceId, false, runnerData, failData);
                });
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
