// 使用者資料
const fs = require('fs');
const path = require('path');
const User = require('../Model/User.js');
const filepath = path.resolve(__dirname, './userdata.json');
const userPool = global.userPool;

// load
try {
    fs.accessSync(filepath);

    console.log('[SYS] 匯入使用者資料....');
    let raw = fs.readFileSync(filepath, 'utf8');
    raw = JSON.parse(raw);

    raw.map((user) => {
        userPool.push(new User(user.lineUserId, user.apikey, user.secret, user.status, user.bound));
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
            bound: user.bound,
        });
    });

    fs.writeFileSync(filepath, JSON.stringify(raw), 'utf8');
}

module.exports = {
    save,
}