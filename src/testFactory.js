const ModuleFactory = require('./baseClasses/ModuleFactory');
const path = require('path');
const CentralRegister = require('./CentralRegister');

class TestFactory extends ModuleFactory {
    getModuleInstance(moduleName, options, instanceId){
        //Get instance:
        const newInstance = super.getModuleInstance(moduleName, options, instanceId);
        //register instance:
        CentralRegister.registerTestInstance(newInstance);
        //return instance
        return newInstance;
    }
}
module.exports = new TestFactory(path.resolve(__dirname, './Tests'));
