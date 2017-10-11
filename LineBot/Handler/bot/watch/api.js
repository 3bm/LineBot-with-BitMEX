const wrapper = require('../../wrapper.js');
module.exports = new wrapper(/^api\s([\w\-]{24}\s[\w\-]{48})$/ig, api);

const User = require('../../../../Model/User');

async function api(event, matchedStr) {
    // 尋找使用者。如果此使用者不在userPool，添加進去
    var idx = global.userPool.findIndex((user) => {
        return user.lineUserId == event.source.userId
    });
    if (idx == -1) {
        global.userPool.push(new User(event.source.userId));
        idx = global.userPool.length - 1;
    };
    var user = global.userPool[idx];

    // 分離apikey和secret
    var tmp = /^([\w\-]{24})\s([\w\-]{48})$/ig.exec(matchedStr);
    var apikey = tmp[1],
        secret = tmp[2];
    // verifyKey
    await user.verifyKey(apikey, secret);
}
