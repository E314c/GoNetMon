/*global describe it*/
const proxyquire = require('proxyquire').noPreserveCache();
const path = require('path');
const expect = require('chai').expect;
const Spy = require('./testUtils/SimpleSpy');
const registerLoggerInstanceSpy = new Spy();
const addTestEventListenerSpy = new Spy();
const loggerFactory = proxyquire('./loggerFactory', {
    './CentralRegister': {
        registerLoggerInstance: registerLoggerInstanceSpy.call
    },
    './GlobalEventPool': {
        addTestEventListener: addTestEventListenerSpy.call
    }
});

describe('loggerFactory', () => {
    it('has the expected pre-loaded constructs:', () => {
        const expectedLoggers =['ConsoleLogger'];
        expect(loggerFactory.getModuleList()).to.deep.equal(expectedLoggers);
    });

    describe('getModuleInstance()', () => {
        const exampleLoggerConfig = {listensTo: ['all']};
        it('registers the created instance', () => {
            //Clear the 'calledWith' of Spy
            registerLoggerInstanceSpy.calledWith = [];
            //Ask for a module instance to be created:
            loggerFactory.getModuleInstance('ConsoleLogger', exampleLoggerConfig, 'testId');
            //Check registration occured:
            expect(registerLoggerInstanceSpy.calledWith.length, 'register LoggerInstace should\'ve been called once').to.deep.equal(1);
            expect(registerLoggerInstanceSpy.calledWith[0][0], 'expected it to have been called with a instance of the module asked for').to.be.instanceOf(require(path.resolve(__dirname, './Loggers/ConsoleLogger')));
            expect(registerLoggerInstanceSpy.calledWith[0][0].instanceId, 'expect it to have the correct ID').to.equal('testId');
        });
        it('notes it\'s listeners on the GlobalEventPool', () => {
            //Clear the 'calledWith' of Spy
            addTestEventListenerSpy.calledWith = [];
            //Ask for a module instance to be created:
            loggerFactory.getModuleInstance('ConsoleLogger', exampleLoggerConfig, 'testId');
            //Check registration occured:
            expect(addTestEventListenerSpy.calledWith.length, 'addTestEventListener should\'ve been called once').to.deep.equal(1);
            expect(addTestEventListenerSpy.calledWith[0][1], 'addTestEventListener second argument should be "listensTo" config section').to.deep.equal(exampleLoggerConfig.listensTo);
            expect(addTestEventListenerSpy.calledWith[0][2], 'addTestEventListener third argument should be loggerId').to.deep.equal('testId');

        });
    });
});
