const LoggerBase = require('../baseClasses/Logger');

class ConsoleLogger extends LoggerBase {

    logTestResults(testId, passed, ...args){
        console.log(`[${this.instanceId}] Test '${testId}' has ${passed? 'passed': 'failed'}.\tExtra data: ${JSON.stringify(args)}`); //eslint-disable-line no-console
    }
}

module.exports = ConsoleLogger;
