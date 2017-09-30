// 限定admin使用
module.exports = (event) => {
    let userId = event.source.userId;

    // 限定admin userId和非房間內使用
    if (typeof event.source.roomId != 'undefined' || typeof event.source.groupId !='undefined') return;
    // if (userId != "adminId") return;

    let inputSymbol, tmp, format;

    // bot list
    // 列出個使用者資料
    format = /^bot\slist$/ig;
    if ((tmp = format.exec(event.message.text)) !== null) {

        let strArray = list.user.map((ele, idx) => {
            return `${idx} : ${JSON.stringify(ele)}`;
        })
        let str = '[User List]\n' + strArray.join('\n');

        return event.reply(str);
    }
}