/*global describe it*/
const proxyquire = require('proxyquire').noPreserveCache();
const path = require('path');
const expect = require('chai').expect;
const Spy = require('./testUtils/SimpleSpy');
const registerTestInstanceSpy = new Spy();
const testFactory = proxyquire('./testFactory', {
    './CentralRegister': {
        registerTestInstance: registerTestInstanceSpy.call
    }
});

describe('testFactory', () => {
    it('has the expected pre-loaded Test classes', () => {
        const expectedModules =['HttpPing'];
        expect(testFactory.getModuleList()).to.deep.equal(expectedModules);
    });

    describe('getModuleInstance()', () => {
        it('registers the created instance', () => {
            //Clear the 'calledWith' of Spy
            registerTestInstanceSpy.calledWith = [];
            //Ask for a module instance to be created:
            testFactory.getModuleInstance('HttpPing', {url: 'localhost'}, 'testId');
            //Check registration occured:
            expect(registerTestInstanceSpy.calledWith.length, 'register TestInstace should\'ve been called once').to.deep.equal(1);
            expect(registerTestInstanceSpy.calledWith[0][0], 'expected it to have been called with a instance of the module asked for').to.be.instanceOf(require(path.resolve(__dirname, './Tests/HttpPing')));
            expect(registerTestInstanceSpy.calledWith[0][0].instanceId, 'expect it to have the correct ID').to.equal('testId');
        });
    });
});
