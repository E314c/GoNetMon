/** This file helps record the state of the system, such as what instances of classes are available.
*/

//TODO replace this with redux at some point, because it'll no doubt get complicated enough to warant it.

const testInstances= {};
const runnerInstances = {};
const loggerInstances = {};

//-- MODULE INTERNAL FUNCTIONS --//
function registerInstance(instance, instanceType){
    let instanceRegister = null;
    switch (instanceType) {
        case 'test':
            instanceRegister = testInstances;
            break;
        case 'runner':
            instanceRegister = runnerInstances;
            break;
        case 'logger':
            instanceRegister = loggerInstances;
            break;
        default:
            throw new Error(`Instance type not defined. Saw ${instanceType}`);
    }
    // Add to register:
    if (instanceRegister[instance.instanceId]){
        throw new Error(`A ${instanceType} instance is already registered under the id: '${instance.instanceId}'`);
    } else {
        instanceRegister[instance.instanceId] = instance;
    }
}

function getInstance(id, instanceType){
    let instanceRegister = null;
    switch (instanceType) {
        case 'test':
            instanceRegister = testInstances;
            break;
        case 'runner':
            instanceRegister = runnerInstances;
            break;
        case 'logger':
            instanceRegister = loggerInstances;
            break;
        default:
            throw new Error(`Instance type not defined. Saw ${instanceType}`);
    }
    // Add to register:
    return instanceRegister[id];
}

//-- MODULE EXPORT FUNCTIONS --//
function registerTestInstance(testInstance){
    return registerInstance(testInstance, 'test');
}
function registerRunnerInstance(runnerInstance){
    return registerInstance(runnerInstance, 'runner');
}
function registerLoggerInstance(loggerInstance){
    return registerInstance(loggerInstance, 'logger');
}

function getTestInstanceList(){
    return Object.keys(testInstances);
}

function getRunnerInstanceList(){
    return Object.keys(runnerInstances);
}

function getLoggerInstanceList(){
    return Object.keys(loggerInstances);
}

function getTestInstance(id){
    return getInstance(id, 'test');
}
function getRunnerInstance(id){
    return getInstance(id, 'runner');
}
function getLoggerInstance(id){
    return getInstance(id, 'logger');
}

module.exports = {
    getTestInstance,
    getRunnerInstance,
    getLoggerInstance,
    getTestInstanceList,
    getRunnerInstanceList,
    getLoggerInstanceList,
    registerTestInstance,
    registerRunnerInstance,
    registerLoggerInstance
};
