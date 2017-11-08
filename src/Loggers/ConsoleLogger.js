const LoggerBase = require('../baseClasses/Logger');

class ConsoleLogger extends LoggerBase {

    logTestResults(testId, passed, ...args){
        console.warn(`[${this.instanceId}] Test '${testId}' has ${passed? 'passed': 'failed'}.\tExtra data: ${JSON.stringify(args)}`);
    }
}

module.exports = ConsoleLogger;
