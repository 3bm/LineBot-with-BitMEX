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
            return event.reply("無法取得userId")
        } else if (typeof list.user.find((ele) => { return ele.id == userId; }) != "undefined") {
            return event.push(userId, "已在清單內");
        } else {
            list.user.push({ id: userId });
            return event.push(userId, "已加入清單");
        }
    }

    // bot remove
    // 將使用者移出追蹤目錄
    format = /^bot\sremove$/ig;
    if ((tmp = format.exec(event.message.text)) !== null) {

        let startIdx;
        let userId = event.source.userId;
        if (typeof userId == 'undefined') {
            return event.reply("無法取得userId")
        } else if ((idx = list.user.findIndex((ele) => { return ele.id == userId; })) != -1) {
            list.user.splice(startIdx, 1);
            return event.push(userId, "已自清單移除");
        } else {
            return event.push(userId, "不在清單內");
        }
    }
}