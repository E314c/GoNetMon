const Module = require('./Module');
class Logger extends Module {
    constructor(loggerOptions, loggerInstanceId) {
        super(loggerOptions, loggerInstanceId);
        this.logTestResults = this.logTestResults.bind(this);
    }

    static optionsSchema() {
        return {
            "type": "object",
            "properties": {
                "listensTo": {
                    "oneOf": [
                        {
                            "enum": ["all", "fail", "pass"]
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                }
            }
        };
    }

    logTestResults(){
        throw new Error(`${this.constructor.name} has not overidden the .logTestResults() method.`);
    }
}

module.exports = Logger;
