/*global describe it*/
const expect = require('chai').expect;
const path = require('path');
const proxyquire = require('proxyquire').noPreserveCache();
const ExampleTestModule = require(path.resolve(__dirname, './testUtils/TestModules/testModule'));
const Spy = require('./testUtils/SimpleSpy');
const registerRunnerInstanceSpy = new Spy();
const getTestInstanceSpy = new Spy(() => new ExampleTestModule());
const runnerFactory = proxyquire('./runnerFactory', {
    './CentralRegister': {
        registerRunnerInstance: registerRunnerInstanceSpy.call,
        getTestInstance: getTestInstanceSpy.call
    },
    './GlobalEventPool': {
        emitTestEvent: () => {} //eslint-disable-line no-empty-function
    }
});

describe('runnerFactory', () => {
    it('has the expected pre-loaded Test classes', () => {
        const expectedModules =['TimedIntervalRunner'];
        expect(runnerFactory.getModuleList()).to.have.members(expectedModules);
    });
    describe('getModuleInstance()', () => {
        it.skip('wraps the super.getModuleInstance() method to inject globalEventPool.emitTestEvent() to module creation', () => {
            expect(true, '[WARN]"wraps super.getModuleInstance(...)" Cannot test this functionality.').to.equal(false);
        });

        it('registers the created instance', () => {
            //Clear the 'calledWith' of Spy
            registerRunnerInstanceSpy.calledWith = [];
            //Ask for a module instance to be created:
            runnerFactory.getModuleInstance('TimedIntervalRunner', {interval: 1000}, 'testRunnerId', []);
            //Check registration occured:
            expect(registerRunnerInstanceSpy.calledWith.length, 'register Runner should\'ve been called once').to.deep.equal(1);
            expect(registerRunnerInstanceSpy.calledWith[0][0], 'expected it to have been called with a instance of the module asked for').to.be.instanceOf(require(path.resolve(__dirname, './Runners/TimedIntervalRunner')));
            expect(registerRunnerInstanceSpy.calledWith[0][0].instanceId, 'expect it to have the correct ID').to.equal('testRunnerId');
        });

        it('gets the test instance by it\'s Id', () => {
            //Clear the 'calledWith' of Spy
            getTestInstanceSpy.calledWith = [];
            //Ask for a module instance to be created:
            runnerFactory.getModuleInstance('TimedIntervalRunner', {interval: 1000}, 'testId', ['myTesterInstanceId', 'secondTesterInstance']);
            //Check registration occured:
            expect(getTestInstanceSpy.calledWith).to.have.length(2, 'get testInstance should\'ve been called twice');
            expect(getTestInstanceSpy.calledWith[0][0], 'expected it to have been called with a id of the test module').to.equal('myTesterInstanceId');
            expect(getTestInstanceSpy.calledWith[1][0], 'expected it to have been called with a id of the test module').to.equal('secondTesterInstance');
        });
    });
});
