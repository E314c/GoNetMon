/**
* This file parses a given configuration object and sets up the system as defined by said object.
*/
//-- Module Imports --//
const TestFactory = require('./testFactory');
const RunnerFactory = require('./runnerFactory');
const LoggerFactory = require('./loggerFactory');
const validate = new (require('ajv'))({
    allErrors: true,
    jsonPointers: true
}).compile(require('../docs/dataSchemas/configurationSchema.json'));

//-- Module Variables --//
let originalConfig= {};

//-- Module Public methods --//
function init(json){
    //validate the JSON
    const valid = validate(json);
    if (!valid){
        const err = new Error(`Configuration failed validation:\n${JSON.stringify(validate.errors, null, ' ')}`);
        err.code = 'ConfigurationValidationFailure';
        throw err;
    }

    //Take a copy
    originalConfig = JSON.parse(JSON.stringify(json)); //Take a copy of the original configuration

    //Create all the Test instances:
    originalConfig.Tests.forEach((testConfig) => {
        TestFactory.getModuleInstance(testConfig.type, testConfig.options, testConfig.id);
    });

    //Create all Runners:
    originalConfig.Runners.forEach((runnerConfig) => {
        RunnerFactory.getModuleInstance(runnerConfig.type, runnerConfig.options, runnerConfig.id, runnerConfig.runs);
    });

    //Create all Loggers:
    originalConfig.Loggers.forEach((loggerConfig) => {
        LoggerFactory.getModuleInstance(loggerConfig.type, loggerConfig.options, loggerConfig.id);
    });
}

module.exports = {
    init
};
