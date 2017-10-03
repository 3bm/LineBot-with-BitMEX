// 將使用者加入追蹤目錄
const wrapper = require('../wrapper.js');
module.exports = new wrapper(/^add$/ig, add);

function add(event) {
    let userId = event.source.userId;
    if (typeof userId == 'undefined') {
        event.reply("無法取得userId")
    } else if (typeof list.user.find((ele) => { return ele.id == userId; }) != "undefined") {
        bot.push(userId, "已在清單內");
    } else {
        list.user.push({ id: userId });
        bot.push(userId, "已加入清單");
    }
}
