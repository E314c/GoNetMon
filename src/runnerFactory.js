const ModuleFactory = require('./baseClasses/ModuleFactory');
const path = require('path');
const globalEventPool = require('./GlobalEventPool');
const CentralRegister = require('./CentralRegister');

class RunnerFactory extends ModuleFactory {
    getModuleInstance(moduleName, options, instanceId, testInstanceId){
        //Get the testClassInstance from the globalRegistry:
        const testInstance = CentralRegister.getTestInstance(testInstanceId);
        if (!testInstance){
            throw new Error(`TestInstance '${testInstanceId}' not found in central register. Try one of ${JSON.stringify(CentralRegister.getTestInstanceList())}`);
        }

        //Get instance:
        const newInstance = super.getModuleInstance(moduleName, options, instanceId, globalEventPool.emitTestEvent, testInstance);
        //register instance:
        CentralRegister.registerRunnerInstance(newInstance);
        //return instance
        return newInstance;
    }
}

module.exports = new RunnerFactory(path.resolve(__dirname, './Runners'));
