const LoggerBase = require('../baseClasses/Logger');
const MongoClient = require('mongodb').MongoClient;

class MongoLogger extends LoggerBase {

    constructor(loggerOptions, loggerInstanceId) {
        super(loggerOptions, loggerInstanceId);

        // Get database config / default those that don't exist
        this.dbHost = loggerOptions.host || 'mongodb://127.0.0.1:27017';
        this.dbUser = loggerOptions.user;
        this.dbDatabase = loggerOptions.database;
        this.dbCollectionName = loggerOptions.collection || this.instanceId;

        //Local variables about clientConnection
        this.client = null;
        this.collection = null;
        this.connectionPromise = MongoClient.connect(this.dbHost, {
            auth: {
                user: this.dbUser,
                password: loggerOptions.password
            }
        }).then((clientConnection) => {
            this.connection = clientConnection;
            this.collection = clientConnection.db(this.dbDatabase).collection(this.dbCollectionName);
            return clientConnection;

        }).catch((err) => {
            console.error(err); //eslint-disable-line no-console
            throw new Error(`Couldn't connect to ${this.dbHost}.\t${err}`);
        });

    }

    logTestResults(testId, passed, runnerData, testData){
        return Promise.all([this.connectionPromise]).then(() => { //always wait until connection established.
            return this.collection.insert(JSON.parse(JSON.stringify({  //cheap deep copy
                testId,
                passed,
                runnerData,
                testData
            })));
        });
    }

    static optionsSchema(){
        return {
            "type": "object",
            "properties": {
                "host": {
                    "type": "string",
                    "format": "uri"
                },
                "user": {"type": "string"},
                "password": {"type": "string"},
                "database": {"type": "string"},
                "collection": {"type": "string"}
            }
        };
    }
}

module.exports = MongoLogger;
