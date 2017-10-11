// 使用者資料
const fs = require('fs');
const User = require('../Model/User.js');
const filepath = './userdata.dat';
const userPool = global.userPool;

// load
try {
    fs.accessSync(filepath);

    console.log('[SYS] 匯入使用者資料....');
    let raw = fs.readFileSync(filepath, 'utf8');
    raw = JSON.parse(raw);

    raw.map((user) => {
        userPool.push(new User(user.lineUserId, user.apikey, user.secret, user.status));
    })
    console.log(`[SYS] 已創立${userPool.length}個User Object`);
} catch (e) {
    console.log('[SYS] 無使用者資料');
}

// save
function save() {
    let raw = [];
    userPool.map((user) => {
        raw.push({
            lineUserId: user.lineUserId,
            apikey: user.apikey,
            secret: user.secret,
            status: user.status,
        });
    });

    fs.writeFileSync(filepath, JSON.stringify(raw), 'utf8');
}

/**
 * process is terminated by Ctrl+C
 */

process.on('exit', () => {
    console.log("[SYS] Process was terminated.");
    save();
});

process.on('SIGINT', async () => {
    // process離開前通知使用者
    // utility.broadcast(`${emoji.get('closed_umbrella')}系統已關閉`);

    // 強制等待
    // await utility.delay(500);

    process.exit();
});