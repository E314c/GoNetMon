const fs = require('fs');
const path = require('path');
const Module = require('./Module');
const {randomAlphaNumeric} = require('../util');
const ajv = new (require('ajv'))({
    allErrors: true,
    jsonPointers: true,
    verbose: true
});

class ModuleFactory {

    /**
     * @param {string} initalModuleDirectory the directory to load
     */
    constructor(initalModuleDirectory){
        this.availableClasses= {};  //initialise avaiableClasses to blank object
        initalModuleDirectory = path.resolve(process.cwd(), initalModuleDirectory); //safety first kids!
        const filesFound= fs.readdirSync(initalModuleDirectory);

        if (filesFound.length > 0){
            //For each file, load it as an available module
            filesFound.forEach(fileName => {
                const resolvedPath = path.resolve(initalModuleDirectory, fileName);
                //check it's a file:
                if (fs.statSync(resolvedPath).isFile()){
                    this.importClass(require(resolvedPath));
                }
            });
        } else {
            throw new Error(`Failed to find any bundled Classes in ${initalModuleDirectory}`);
        }
    }

    importClass(newModule, className){
        //Make sure it's an instance of Module
        if (!(Object.prototype.isPrototypeOf.call(Module, newModule))){
            throw new TypeError(`${newModule}(${typeof newModule}) is not an extension of the a Module class.`);
        }
        //Determine a name if not given
        if (!className){
            className= newModule.name;
        }

        //Add it to the list.
        this.availableClasses[className] = newModule;
    }

    /**
     * @returns {Array.<string>} Available class names
     */
    getModuleList(){
        return Object.keys(this.availableClasses);
    }

    getModuleInstance(moduleName, options, instanceId, ...additonalArgs){
        //check we have a module class under that name:
        const ModuleClass = this.availableClasses[moduleName];
        if (!ModuleClass){
            throw new Error(`Module '${moduleName}' not found.`);
        }

        //check the options are valid for that type of class
        const valid = ajv.validate(ModuleClass.optionsSchema(), options);
        if (!valid){
            const err = new Error(`Failed optionsSchema for ${moduleName}. \n---AJV errors: ---\n${JSON.stringify(ajv.errors, null, ' ')}`);
            err.code = 'ModuleConstructorOptionsFailure';
            throw err;
        }

        //return an instance of the class:
        return new ModuleClass(options, instanceId || `${moduleName}_${randomAlphaNumeric(6)}`, ...additonalArgs);
    }
}

module.exports = ModuleFactory;
