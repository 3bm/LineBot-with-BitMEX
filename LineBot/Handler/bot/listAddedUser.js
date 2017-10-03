const wrapper = require('../wrapper.js');

module.exports = new wrapper(/^list$/ig, listAllAddedUser);

function listAllAddedUser(event) {

    // 限定admin userId和非房間內使用
    if (typeof event.source.roomId != 'undefined' || typeof event.source.groupId != 'undefined') return;
    // if (event.source.userId != "adminId") return;

    let strArray = global.list.user.map((ele, idx) => {
        return `${idx} : ${JSON.stringify(ele)}`;
    })
    let str = '[User List]\n' + strArray.join('\n');

    event.reply(str);
}

