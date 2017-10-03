// 加入/移出清單
module.exports = (event) => {
    // 使用者輸入
    let inputSymbol, tmp, format;

    // bot add
    // 將使用者加入追蹤目錄
    format = /^bot\sadd$/ig;
    if ((tmp = format.exec(event.message.text)) !== null) {

        let userId = event.source.userId;
        if (typeof userId == 'undefined') {
            event.reply("無法取得userId")
            return ture;
        } else if (typeof list.user.find((ele) => { return ele.id == userId; }) != "undefined") {
            bot.push(userId, "已在清單內");
            return ture;
        } else {
            list.user.push({ id: userId });
            bot.push(userId, "已加入清單");
            return ture;
        }
    }

    // bot remove
    // 將使用者移出追蹤目錄
    format = /^bot\sremove$/ig;
    if ((tmp = format.exec(event.message.text)) !== null) {

        let startIdx;
        let userId = event.source.userId;
        if (typeof userId == 'undefined') {
            event.reply("無法取得userId");
            return true;
        } else if ((idx = list.user.findIndex((ele) => { return ele.id == userId; })) != -1) {
            list.user.splice(startIdx, 1);
            bot.push(userId, "已自清單移除");
            return true;
        } else {
            bot.push(userId, "不在清單內");
            return true;
        }
    }
}