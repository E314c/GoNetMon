
function randomAlphaNumeric(length){
    let str = "";
    do {
        str+=Math.random().toString(36).slice(2);
    } while (str.length < length);
    return str.slice(0, length);
}

module.exports= {
    randomAlphaNumeric
};
