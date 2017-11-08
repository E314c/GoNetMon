const Module = require('./Module');
class Test extends Module {
    constructor(testOptions, testInstanceId){
        super(testOptions, testInstanceId);
        //bind class methods
        this.test = this.test.bind(this);
    }

    test(){
        throw Error(`${this.constructor.name} has not overidden the .test() method.`);
    }

    static optionsSchema(){
        return {};
    }

    verifyConfig(){ //eslint-disable-line class-methods-use-this
        return true;
    }
}

module.exports = Test;
