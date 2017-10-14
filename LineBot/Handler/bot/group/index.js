const wrapper = require('../../wrapper.js');
const Group = require('../../../../Model/Group');

module.exports = new wrapper(/^group\s(.+)$/ig, group);

const rekt = require('./rekt'); // BitMEX爆倉提醒

function group(event, matchedStr) {

    if (event.source.roomId || event.source.groupId) {

        let groupLineId = event.source.roomId || event.source.groupId;

        // 尋找Group。如果此Group不在groupPool，添加進去
        var idx = global.groupPool.findIndex((group) => {
            return group.groupLineId == groupLineId;
        });
        if (idx == -1) {
            global.groupPool.push(new Group(groupLineId, false));
            idx = global.groupPool.length - 1;
        };

        // 爆倉通知
        rekt.test(event, matchedStr);

    } else {
        event.reply('此指令僅可在room或group中使用');
    }

}