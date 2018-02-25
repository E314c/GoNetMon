const Test = require('../baseClasses/Test');
const http = require('http');

class HttpPing extends Test {

    test(){
        const self = this;
        return new Promise((resolve, reject) => {
            const options = {
                host: self.options.url,
                port: self.options.port || 80,
                path: '/'
            };

            const start = Date.now();
            const pingRequest = http.request(options, () => {
                resolve(Date.now() - start);
                pingRequest.abort();
            });

            //Add timeout if specified.
            if(self.options.maxPing){
                pingRequest.setTimeout(self.options.maxPing, () => {
                    reject(`Ping >${self.options.maxPing}`);
                    pingRequest.abort();
                });
            }

            pingRequest.on("error", () => {
                reject(-1);
                pingRequest.abort();
            });
            //Start request
            pingRequest.end();
        });
    }

    static optionsSchema(){
        return {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    pattern: (/^(?:(?:(?:\d{1,3}\.){3}\d{1,3})|(?:[\w\d-.]+\w{2,}))(?:\/[\w\d-.]+)*(?:\?[\w\d=\[\]]+)?$/).toString().slice(1, -1)    //eslint-disable-line no-useless-escape
                },
                port: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 65535
                },
                maxPing: {
                    type: 'integer',
                    description: 'Set up limit on ping timeout'
                }
            },
            required: ['url']
        };
    }
}
module.exports = HttpPing;
