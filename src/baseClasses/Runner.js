const Module = require('./Module');
const TestBaseClass = require('./Test');

class Runner extends Module {
    constructor (runnerOptions, instanceId, postTestResult, testClassInstances){
        super(runnerOptions, instanceId);

        //check required args:
        if (!(postTestResult && typeof postTestResult === 'function')) {
            throw new TypeError(`Instance of Runner must be given a function 'postTestResults', saw '${postTestResult}'`);
        }
        // Check testClassInstances:
        if (!(testClassInstances
            && testClassInstances instanceof Array
            && testClassInstances.every(x => (x instanceof TestBaseClass))
        )) {
            throw new TypeError(`Instances of Runner must be given an Array of TestClassInstances to run. Got a '${testClassInstances.constructor.name}'`);
        }

        //Store construction values:
        this.postTestResult = postTestResult;
        this.testClassInstances = testClassInstances;

        //bind class methods
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    static optionsSchema(){
        return {};
    }

    start(){
        throw Error(`${this.constructor.name} has not overidden the .start() method.`);
    }

    stop(){
        throw Error(`${this.constructor.name} has not overidden the .stop() method.`);
    }
}

module.exports = Runner;
