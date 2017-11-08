/* globals describe it*/
const {expect} = require('chai');
const randString = require('./randString');
describe('util/randString', () => {
    describe('.randomAlphaNumeric()', () => {
        it('will generate a randomon alphanumeric string of a given length', () => {
            const testLengths = [12, 5, 55, 100, 1, 0];
            testLengths.forEach((length) => {
                expect(randString.randomAlphaNumeric(length).length).to.equal(length);
            });
        });

        it('the generated string is only alphanumeric (50 checks)', () => {
            //performs 50 checks for safety sake:
            for (let i = 0; i < 50; i++){
                expect(randString.randomAlphaNumeric(6)).to.match(/[a-z0-9]+/);
            }
        });
    });
});
