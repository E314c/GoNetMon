class Module {
    constructor(options, instanceId){
        this.options = options;
        this.instanceId = instanceId;
    }

    static optionsSchema(){
        return {};
    }
}

module.exports = Module;
