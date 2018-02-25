const argv = require('./args');
const path = require('path');
const CentralRegister = require('./CentralRegister');

const config = require(path.resolve(process.cwd(), argv.configFile));
console.log(`Loaded ${argv.configFile}`); //eslint-disable-line no-console
//use config parser:
require('./configurationParser').init(config);

//Start off all the runners:
CentralRegister.getRunnerInstanceList().forEach((runnerInstanceId) => {
    CentralRegister.getRunnerInstance(runnerInstanceId).start();
    console.log(`Runner '${runnerInstanceId}' was started.`); //eslint-disable-line no-console
});
