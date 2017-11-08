/*
Intended functionality:
- Test Runners register to emit events into this pool.
- Data Loggers or Alert Rules register to receive events.
*/
const ajv = new (require('ajv'))({
    allErrors: true,
    jsonPointers: true
});
const listenerConfigSchema = require('../docs/dataSchemas/listensTo_schema.json');
const validateListnerSchema = ajv.compile(listenerConfigSchema);

// -- MODULE GLOBALS  --//
/**
This data object is to store the current state of what loggers are listening to what Tests
The format is: {
    'pass': [<array of loggerInstance names listening for all pass events],
    'fail': [<array of loggerInstance names listening for all fail events],
    <testName>: {
        pass: [ <array of logger instance names listening for this> ],
        fail: [ <array of logger instance names listening for this> ]
    }
}
This object can then be reduced to determine which listeners need to be informed.
The names are then looked up in the listenerMap to find the function to call
*/
const initialConfig = () => {
    return JSON.parse(JSON.stringify({
        pass: [],
        fail: []
    }));
};

const listenerConfigs = initialConfig();
const listenerMap = {};

//-- INTERNAL MODULE FUNCTIONS --//
function pushListenerHandler(array, id){
    if (!array.includes(id)){
        array.push(id);
    }
}

function addListenerConfig(listenerId, config){
    if (typeof config === 'string'){
        switch (config){
            case 'all':
                pushListenerHandler(listenerConfigs.pass, listenerId);
                pushListenerHandler(listenerConfigs.fail, listenerId);
                break;
            case 'pass':
                pushListenerHandler(listenerConfigs.pass, listenerId);
                break;
            case 'fail':
                pushListenerHandler(listenerConfigs.fail, listenerId);
                break;
            default:
                throw new Error(`Unknown listener config ${config}`);
        }
    } else {
        config.forEach((configItem) => {
            if (typeof configItem === 'string'){
                if (!listenerConfigs[configItem]){                       //Check if we've got an object for this testIntance yet:
                    listenerConfigs[configItem] = initialConfig();      //initialise the object
                }
                pushListenerHandler(listenerConfigs[configItem].pass, listenerId);
                pushListenerHandler(listenerConfigs[configItem].fail, listenerId);
            } else { //Must be an object declaration:
                if (!listenerConfigs[configItem.test]){                       //Check if we've got an object for this testIntance yet:
                    listenerConfigs[configItem.test] = initialConfig();      //initialise the object
                }
                if (configItem.condition === 'pass' || configItem.condition === 'all'){
                    pushListenerHandler(listenerConfigs[configItem.test].pass, listenerId);
                }
                if (configItem.condition === 'fail' || configItem.condition === 'all'){
                    pushListenerHandler(listenerConfigs[configItem.test].fail, listenerId);
                }
            }
        });
    }
}

//-- EXPORTABLE MODULE FUNCTIONS --//
//Add a callback based on listener options
function addTestEventListener(listenerFunction, listenerOptions, listenerId){
    //Confirm the schema of the listenerOptions:
    if (!validateListnerSchema(listenerOptions)){
        throw new Error(`Listener Config not valid. Saw ${listenerOptions}\nErrors:\n${JSON.stringify(validateListnerSchema.errors, null, ' ')}`);
    }

    //Add the listener to the listenerMap
    if (listenerMap[listenerId]){
        console.warn(`Listener instance '${listenerId}' was already registered, but will be re-registered`);
    }

    listenerMap[listenerId] = listenerFunction;
    //Parse the listnerConfig and that to the global set
    addListenerConfig(listenerId, listenerOptions);
}

//Emit a new test event
function emitTestEvent(testInstanceId, passed, ...args){
    const passedString = passed? 'pass': 'fail';

    //Compile a list from the union of generic condition listeners and the test specific condition listeners.
    const testSpecificListeners = listenerConfigs[testInstanceId] || initialConfig();   //safety incase testId not known in advance.
    const  callbackIds = testSpecificListeners[passedString].reduce((acc, listenerId) => {
        if (!acc.includes(listenerId)){  //Add listener if not already present
            acc.push(listenerId);
        }
        return acc;
    }, JSON.parse(JSON.stringify(listenerConfigs[passedString]))); //start with a copy of the global listeners.

    //Call each of them!
    callbackIds.forEach((loggerId) => {
        listenerMap[loggerId](testInstanceId, passed, ...args);
    });
}

//-- MODULE EXPORTS --/
module.exports = {
    addTestEventListener,
    emitTestEvent
};
