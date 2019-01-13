const LoggerBase = require('../baseClasses/Logger');

const TERMINAL_CODES =  {
    COLOURS: {
        BLACK: '\u001b[30m',
        RED: '\u001b[31m',
        GREEN: '\u001b[32m',
        YELLOW: '\u001b[33m',
        BLUE: '\u001b[34m',
        MAGENTA: '\u001b[35m',
        CYAN: '\u001b[36m',
        WHITE: '\u001b[37m',
        RESET: '\u001b[0m'
    },
    DECORATION: {
        BOLD: '\u001b[1m',
        UNDERLINE: '\u001b[4m',
        REVERSED: '\u001b[7m'
    }
};

const STRINGS = {
    PASSED: 'passed',
    FAILED: 'failed'
};

class ConsoleLogger extends LoggerBase {

    optionsSchema(){
        const original = super.optionsSchema();

        return {
            type: 'object',
            properties: {
                ...original.properties,
                pretty: {
                    type: 'boolean'
                },
                extraData: {
                    type: 'boolean'
                }
            }
        };
    }

    logTestResults(testId, passed, ...args){

        let stringToLog = `[${this.instanceId}]`;

        if (this.options.pretty) {
            stringToLog += ` ${passed? TERMINAL_CODES.COLOURS.GREEN : TERMINAL_CODES.COLOURS.RED}'${testId}' has ${TERMINAL_CODES.DECORATION.BOLD}${passed ? STRINGS.PASSED : STRINGS.FAILED}${TERMINAL_CODES.COLOURS.RESET}`;
        } else {
            stringToLog += ` '${testId}' has ${passed ? STRINGS.PASSED : STRINGS.FAILED}`;
        }

        if (this.options.extraData) {
            stringToLog += `\tExtra data: ${JSON.stringify(args)}`;
        }

        console.log(stringToLog); //eslint-disable-line no-console
    }
}

module.exports = ConsoleLogger;
