const ModuleFactory = require('./baseClasses/ModuleFactory');
const path = require('path');
const globalEventPool = require('./GlobalEventPool');
const CentralRegister = require('./CentralRegister');

class LoggerFactory extends ModuleFactory {
    getModuleInstance(moduleName, options, instanceId){
        //get instance:
        const loggerInstance= super.getModuleInstance(moduleName, options, instanceId);
        //add it's listeners to the globalEventPool:
        globalEventPool.addTestEventListener(loggerInstance.logTestResults, options.listensTo, loggerInstance.instanceId);

        //Add it to the CentralRegister
        CentralRegister.registerLoggerInstance(loggerInstance);

        //return it to the user
        return loggerInstance;
    }
}

module.exports = new LoggerFactory(path.resolve(__dirname, './Loggers'));
