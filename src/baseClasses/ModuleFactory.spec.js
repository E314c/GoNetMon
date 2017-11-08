/*global describe it*/
const expect = require('chai').expect;
const ModuleFactory = require('./ModuleFactory');

const path = require('path');
const TEST_MODULE_DIRECTORY = path.resolve(__dirname, '../testUtils/TestModules');
const MODULES_IN_TEST_DIRECTORY = [
    'TestModule',
    'TestRunnerModule',
    'SchemaFailer'
];

describe('ModuleFactory', () => {

    it('can be constructed with a directory path argument', () => {
        const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
        expect(uut).to.exist;   //eslint-disable-line no-unused-expressions
    });

    describe('after creating an instance', () => {
        describe('getModuleList()', () => {
            it('returns a list of modules available', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                const expectedTests= MODULES_IN_TEST_DIRECTORY;
                expect(uut.getModuleList()).to.have.members(expectedTests);
            });
        });

        describe('importClass()', () => {
            it('allows you to add additional modules to the factory', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                //Create a new class that extends module
                class newModule extends (require('./Module')) {}
                //Add it to the list
                uut.importClass(newModule, 'newModule');
                //Expect the new module to be in the list of available modules
                expect(uut.getModuleList()).to.have.members([...MODULES_IN_TEST_DIRECTORY, 'newModule']);

                //And extensions of extensions:
                class newLogger extends (require('./Logger')) {}
                //Add it to the list
                uut.importClass(newLogger, 'newLogger');
                //Expect the new module to be in the list of available modules
                expect(uut.getModuleList()).to.have.members([...MODULES_IN_TEST_DIRECTORY, 'newModule', 'newLogger']);

            });

            it('throws a TypeError if import is not extension of \'Module\' class', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                //Create a new class that extends module
                class newModule {}
                //Add it to the list
                const throwable = () => {
                    uut.importClass(newModule, 'newModule');
                };
                //Expect the new module to be in the list of available modules
                expect(throwable).to.throw();
            });
        });

        describe('getModuleInstance()', () => {
            it('creates a module, passing in the options given and setting the instance name given', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                const givenId = 'ExampleId';
                const givenOptions = {url: 'localhost'};
                const createdTest = uut.getModuleInstance('TestModule', givenOptions, givenId);
                expect(createdTest).to.be.instanceOf(require(path.resolve(TEST_MODULE_DIRECTORY, './testModule')));
                expect(createdTest.instanceId).to.equal(givenId);
                expect(createdTest.options).to.deep.equal(givenOptions);
            });

            it('can be given additional arguements to be post-fixed to the module constructor args.', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                const givenId = 'ExampleId';
                const givenOptions = {url: 'localhost'};
                const fakePostTestResultFunction = (x) => {
                    return ++x;
                };
                const fakeTestClassInstance = new (require(path.resolve(TEST_MODULE_DIRECTORY, './testModule')))();
                const createdTest = uut.getModuleInstance('TestRunnerModule', givenOptions, givenId, fakePostTestResultFunction, fakeTestClassInstance);
                expect(createdTest).to.be.instanceOf(require(path.resolve(TEST_MODULE_DIRECTORY, './testRunnerModule')));
                expect(createdTest.instanceId).to.equal(givenId);
                expect(createdTest.options).to.deep.equal(givenOptions);
            });

            it('gives the instance a name in the format `<moduleClass>_[\\w\\d]{6}` if no instanceId given', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                const givenOptions = {url: 'localhost'};
                const createdTest = uut.getModuleInstance('TestModule', givenOptions);
                expect(createdTest).to.be.instanceOf(require(path.resolve(TEST_MODULE_DIRECTORY, './testModule')));
                expect(createdTest.instanceId).to.match(/^TestModule_[\w\d]{6}$/);
                expect(createdTest.options).to.deep.equal(givenOptions);
            });

            it('throws an error if given options do not match the ModuleClass\'s optionSchema', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                const givenId = 'ExampleId';
                const givenOptions = {missing: 'the url param'};
                const throwNow = () => uut.getModuleInstance('SchemaFailer', givenOptions, givenId);
                expect(throwNow).to.throw();
            });

            it('throws an error if asked for a non-loaded ModuleClass', () => {
                const uut = new ModuleFactory(TEST_MODULE_DIRECTORY);
                const givenId = 'ExampleId';
                const givenOptions = {url: 'localhost'};
                const throwNow = () => uut.getModuleInstance('ThisClassDoesNotExist', givenOptions, givenId);
                expect(throwNow).to.throw();
            });
        });
    });
});
