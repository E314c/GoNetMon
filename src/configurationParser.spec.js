/*global describe it*/
const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache();
const Spy = require('./testUtils/SimpleSpy');
const testGetModuleInstanceSpy = new Spy();
const runnerGetModuleInstanceSpy = new Spy();
const loggerGetModuleInstanceSpy = new Spy();
const configurationParser = proxyquire('./configurationParser', {
    './testFactory': {getModuleInstance: testGetModuleInstanceSpy.call},
    './runnerFactory': {getModuleInstance: runnerGetModuleInstanceSpy.call},
    './loggerFactory': {getModuleInstance: loggerGetModuleInstanceSpy.call}
});

describe('configurationParser', () => {

    describe('init()', () => {
        it('throws an error if an invalid configuration is given', () => {

            /*Bad Configs*/
            [
                {}, //empty object,
                {"Tests": []}, //Missing "Runners" and "Loggers"
                {"Tests": {}, "Runners": [], "Loggers": []}, //"Tests" should be array
                {"Tests": [], "Runners": [], "Loggers": [], "extra": "data"}, //No additional objects
                {"Tests": [{"id": "bob", "options": {}}], "Runners": [], "Loggers": []}  // Tests.[0] is missing required field "type"
            ].forEach((config) => {
                const throwNow = () => {
                    configurationParser.init(config);
                };
                expect(throwNow).to.throw();
            });

        });

        it('Creates a test instance for each one given in the config [via testFactory.getModuleInstance()]', () => {
            const config = {
                "Tests": [{"type": "BlobModule"}],
                "Runners": [],
                "Loggers": []
            };
            //Clear the spy
            testGetModuleInstanceSpy.calledWith = [];

            //Run init
            configurationParser.init(config);

            expect(testGetModuleInstanceSpy.calledWith.length, `Expected ${config.Tests.length} calls, saw ${testGetModuleInstanceSpy.calledWith.length}`).to.equal(config.Tests.length);
        });

        it('accepts all the example configurations', () => {
            const path = require('path');
            const fs = require('fs');
            const exampleConfigDirectory = path.resolve(__dirname, '../examples');
            //For each example config file:
            fs.readdirSync(exampleConfigDirectory).forEach((fileName) => {
                const exampleConfig = require(path.resolve(exampleConfigDirectory, fileName));
                try {
                    configurationParser.init(exampleConfig);
                } catch (e){
                    // It'll throw if it's bad:
                    const message = `Example config '${fileName}' failed validation`;
                    throw new Error(message);
                }
            });
        });
    });
});
