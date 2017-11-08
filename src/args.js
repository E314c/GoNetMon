const argv = require('yargs')
    .option('configFile', {
        alias: 'c',
        describe: 'The path to the config file.'
    })

    /*
.option('',{
    alias: ''
})
*/
    .demandOption(['configFile'], 'You must specify a config file.')
    .argv;

module.exports= argv;
