const argv = require('./args');
const path = require('path');
const CentralRegister = require('./CentralRegister');

const config = require(path.resolve(process.cwd(), argv.configFile));
console.log(`Loaded ${argv.configFile}`);
//use config parser:
require('./configurationParser').init(config);

//Start off all the runners:
CentralRegister.getRunnerInstanceList().forEach((runnerInstanceId) => {
    CentralRegister.getRunnerInstance(runnerInstanceId).start();
    console.log(`Runner '${runnerInstanceId}' was started.`);
});
