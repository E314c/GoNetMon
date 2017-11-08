const Module = require('./Module');
const TestBaseClass = require('./Test');

class Runner extends Module {
    constructor (runnerOptions, instanceId, postTestResult, testClassInstance){
        super(runnerOptions, instanceId);
        //check required args:
        if (!(postTestResult && typeof postTestResult === 'function') ||
            !(testClassInstance && (testClassInstance instanceof TestBaseClass))
        ){
            throw new TypeError(`Instance of Runner must be given a function 'postTestResults' and a instance of a test class, saw '${postTestResult}' and '${testClassInstance}' respectively.`);
        }

        //Store construction values:
        this.postTestResult = postTestResult;
        this.testClassInstance = testClassInstance;

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
