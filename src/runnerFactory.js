const ModuleFactory = require('./baseClasses/ModuleFactory');
const path = require('path');
const globalEventPool = require('./GlobalEventPool');
const CentralRegister = require('./CentralRegister');

class RunnerFactory extends ModuleFactory {

    /**
     * @param {string} moduleName The name of the module to start an instance of
     * @param {Object} options The configuration options of that module
     * @param {string} instanceId The instanceId for this instance
     * @param {Array.<string>} testInstanceIds The ids for the tests run by this module
     * @returns {Runner} A new instance of the Runner Module requested.
     */
    getModuleInstance(moduleName, options, instanceId, testInstanceIds){
        // Get the testClassInstances from the globalRegistry:
        const testInstances = testInstanceIds.map(testInstanceId => {
            const testInstance = CentralRegister.getTestInstance(testInstanceId);
            if (!testInstance){
                throw new Error(`TestInstance '${testInstanceId}' not found in central register. Try one of ${JSON.stringify(CentralRegister.getTestInstanceList())}`);
            }
            return testInstance;
        });

        // Get instance:
        const newInstance = super.getModuleInstance(moduleName, options, instanceId, globalEventPool.emitTestEvent, testInstances);
        // register instance:
        CentralRegister.registerRunnerInstance(newInstance);
        // return instance
        return newInstance;
    }
}

module.exports = new RunnerFactory(path.resolve(__dirname, './Runners'));
