const wrapper = require('../../wrapper.js');
module.exports = new wrapper(/^start\s?([\d\.]+)?$/ig, start);

const User = require('../../../../Model/User');

async function start(event, matchedStr) {
    // 尋找使用者。如果此使用者不在userPool，添加進去
    var idx = global.userPool.findIndex((user) => {
        return user.lineUserId == event.source.userId
    });
    if (idx == -1){
        global.userPool.push(new User(event.source.userId));
        idx = global.userPool.length -1;
    } ;
    var user = global.userPool[idx];

    // start
    let bound = matchedStr;
    await user.start(bound);
}