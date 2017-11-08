/*global describe it*/
const proxyquire = require('proxyquire').noPreserveCache();
const expect = require('chai').expect;

class SpyLogger {
    constructor(){
        this.calledWith=[];
        this.call = this.call.bind(this);
    }
    call(...args){
        this.calledWith.push(args);
    }
}

describe('GlobalEventPool', () => {
    describe('given the config shown in the test file:', () => {
        const globalEventPool = proxyquire('./GlobalEventPool', {});
        const testEventSet = [['A', false], ['A', true], ['B', false], ['B', true]];
        //Set up the listeners:
        const logAll = new SpyLogger();
        globalEventPool.addTestEventListener(logAll.call, 'all', 'logAll');

        const logA = new SpyLogger();
        globalEventPool.addTestEventListener(logA.call, ['A'], 'logA');
        const logB = new SpyLogger();
        globalEventPool.addTestEventListener(logB.call, ['B'], 'logB');

        const logFails = new SpyLogger();
        globalEventPool.addTestEventListener(logFails.call, 'fail', 'logFails');
        const logPass = new SpyLogger();
        globalEventPool.addTestEventListener(logPass.call, 'pass', 'logPass');

        const logAPass = new SpyLogger();
        globalEventPool.addTestEventListener(logAPass.call, [{test: 'A', condition: 'pass'}], 'logAPass');
        const logBFails = new SpyLogger();
        globalEventPool.addTestEventListener(logBFails.call, [{test: 'B', condition: 'fail'}], 'logBFails');

        //Lets pretend all those test conditions happened:
        testEventSet.forEach((eventArgs) => {
            globalEventPool.emitTestEvent(...eventArgs);
        });

        it(`the 'all' identifier works correctly`, () => {
            expect(logAll.calledWith.length).to.equal(testEventSet.length); //should've seen all events
            expect(logAll.calledWith).to.have.deep.members(testEventSet);    //Should be the same events
        });

        it(`the 'pass' identifier works correctly`, () => {
            const filteredTestSet = testEventSet.filter(e => e[1]===true);
            expect(logPass.calledWith.length).to.equal(filteredTestSet.length); //should've seen all 'fail' events
            expect(logPass.calledWith).to.have.deep.members(filteredTestSet);    //Should be the same events
        });

        it(`the 'fail' identifier works correctly`, () => {
            const filteredTestSet = testEventSet.filter(e => e[1]===false);
            expect(logFails.calledWith.length).to.equal(filteredTestSet.length); //should've seen all 'fail' events
            expect(logFails.calledWith).to.have.deep.members(filteredTestSet);    //Should be the same events
        });

        it(`filtering by test instanceId works correctly`, () => {
            const filteredTestSetA = testEventSet.filter(e => e[0]==='A');
            expect(logA.calledWith.length, 'Did not get expected results on logA').to.equal(filteredTestSetA.length); //should've seen all 'A' events
            expect(logA.calledWith).to.have.deep.members(filteredTestSetA);    //Should be the same events

            const filteredTestSetB = testEventSet.filter(e => e[0]==='B');
            expect(logB.calledWith.length, 'Did not get expected results on logB').to.equal(filteredTestSetB.length); //should've seen all 'B' events
            expect(logB.calledWith).to.have.deep.members(filteredTestSetB);    //Should be the same events
        });

        it(`filtering by test instanceId and condition works correctly`, () => {
            const filteredTestSetA = testEventSet.filter(e => e[0]==='A' && e[1]===true);
            expect(logAPass.calledWith.length, 'Did not get expected results on logAPass').to.equal(filteredTestSetA.length); //should've seen all 'A' 'pass' events
            expect(logAPass.calledWith).to.have.deep.members(filteredTestSetA);    //Should be the same events

            const filteredTestSetB = testEventSet.filter(e => e[0]==='B' && e[1]===false);
            expect(logBFails.calledWith.length, 'Did not get expected results on logBFail').to.equal(filteredTestSetB.length); //should've seen all 'B' 'fail' events
            expect(logBFails.calledWith).to.have.deep.members(filteredTestSetB);    //Should be the same events

        });
    });
    it('Can handle previously unknown testIds', () => {
        const globalEventPool = proxyquire('./GlobalEventPool', {});
        //Set up the listener for ALL, but don't add any specific config for this testInstance
        const logAll = new SpyLogger();
        globalEventPool.addTestEventListener(logAll.call, 'all', 'logAll');
        //Emit testEventSet
        globalEventPool.emitTestEvent('X', false);

        //expectations:
        expect(logAll.calledWith.length).to.equal(1); //should've seen an event
        expect(logAll.calledWith[0]).to.deep.equal(['X', false]);    //Should be the same events

    });
});
