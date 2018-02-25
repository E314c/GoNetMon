const Test = require('../baseClasses/Test');
const dns = require('dns');

class DnsResolve extends Test {

    test(){
        const self = this;
        return new Promise((resolve, reject) => {
            dns.lookup(self.options.hostname, (err, address, family) => {
                if(err){
                    reject(err);
                }

                const ret = {
                    host: self.options.hostname,
                    addr: address,
                    addrType: family
                };

                if(address === self.options.expectedIp){
                    resolve(ret);
                } else {
                    reject(ret);
                }

            });
        });
    }

    static optionsSchema(){
        return {
            type: 'object',
            properties: {
                hostname: {
                    type: 'string',
                    format: 'hostname'
                },
                expectedIp: {
                    type: 'string'
                }
            },
            required: ['hostname', 'expectedIp']
        };
    }
}
module.exports = DnsResolve;
