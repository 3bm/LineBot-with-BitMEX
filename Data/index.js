const user = require('./User.js');
const group = require('./Group.js');
const emoji = require('node-emoji');

const utility = require('../LineBot/Utility');

module.exports = null;

/**
 * process is terminated by Ctrl+C
 */

process.on('exit', () => {
    console.log("[SYS] Process was terminated. Save the change....");
    
    // Save
    user.save();
    group.save();
});

process.on('SIGINT', async () => {
    // process離開前通知使用者
    utility.broadcast(`${emoji.get('closed_umbrella')}系統已關閉`);

    // 強制等待
    await utility.delay(500);

    process.exit();
});