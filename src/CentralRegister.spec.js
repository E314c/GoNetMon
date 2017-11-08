/*global describe it*/
const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache();
const CentralRegister = proxyquire('./CentralRegister', {});

describe('CentralRegister', () => {

    const getSetFunctions =[
        {
            type: 'Test',
            get: 'getTestInstanceList',
            set: 'registerTestInstance'
        },
        {
            type: 'runner',
            get: 'getRunnerInstanceList',
            set: 'registerRunnerInstance'
        },
        {
            type: 'logger',
            get: 'getLoggerInstanceList',
            set: 'registerLoggerInstance'
        }
    ];

    getSetFunctions.forEach((pair) => {
        it(`The registering function '${pair.set}' exists`, () => {
            expect(CentralRegister).to.respondTo(pair.set);
        });

        it(`The listing function '${pair.get}' exists`, () => {
            expect(CentralRegister).to.respondTo(pair.get);
        });

        const tmpCentralRegister = proxyquire('./CentralRegister', {});

        it(`Can add ${pair.type} instances`, () => {
            //should be empty at start of test
            expect(tmpCentralRegister[pair.get]()).to.be.empty; //eslint-disable-line no-unused-expressions
            //Register a module with the name "test":
            tmpCentralRegister[pair.set](new (require('./baseClasses/Test'))({}, 'test'));
            expect(tmpCentralRegister[pair.get]().length).to.equal(1); //should be 1 new instance
            expect(tmpCentralRegister[pair.get]()[0]).to.equal('test'); //should be called 'test'
        });
    });
});
