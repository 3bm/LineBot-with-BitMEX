// 將使用者移出追蹤目錄
const wrapper = require('../wrapper.js');
module.exports = new wrapper(/^remove$/ig, remove);

function remove(event) {
    console.log("enter remove")
    let startIdx;
    let userId = event.source.userId;
    if (typeof userId == 'undefined') {
        event.reply("無法取得userId");
    } else if ((idx = global.list.user.findIndex((ele) => { return ele.id == userId; })) != -1) {
        list.user.splice(startIdx, 1);
        bot.push(userId, "已自清單移除");
    } else {
        bot.push(userId, "不在清單內");
    }
}