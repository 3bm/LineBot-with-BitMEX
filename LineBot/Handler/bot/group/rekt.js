const wrapper = require('../../wrapper.js');

module.exports = new wrapper(/^rekt$/ig, rekt);

// BitMEX爆倉提醒(於群組)
async function rekt(event, debug) {

    let groupLineId = event.source.roomId || event.source.groupId;
    
    // 尋找Group
    var idx = global.groupPool.findIndex((group) => {
        return group.groupLineId == groupLineId;
    });
    var group = global.groupPool[idx];

    // 開關rekt 限定XBT合約
    if (group.ToggleRekt()){
        event.reply('Liquidation Notice: ON.\n限定XBTUSD/Z17合約且倉位>300k USD');
    }else{
        event.reply('Liquidation Notice: OFF.');
    }
}