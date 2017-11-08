const TestBaseClass = require('../../baseClasses/Test');

class SchemaFailer extends TestBaseClass {
    static optionsSchema(){
        return {
            "type": "string",
            "pattern": "$ ^" //impossible!
        };
    }
}

module.exports = SchemaFailer;
