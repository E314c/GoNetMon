module.exports = class SpyLogger {
    constructor(spiedFunc){
        this.calledWith=[];
        this.call = this.call.bind(this);
        this.func = spiedFunc;
    }
    call(...args){  //eslint-disable-line consistent-return
        this.calledWith.push(args);
        if (this.func){
            return this.func(...args);
        }
    }
};
