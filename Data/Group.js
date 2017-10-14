// Group and room資料
const fs = require('fs');
const path = require('path');
const Group = require('../Model/Group.js');
const filepath = path.resolve(__dirname, './groupdata.json');
const groupPool = global.groupPool;

// load
try {
    fs.accessSync(filepath);

    console.log('[SYS] 匯入Group資料....');
    let raw = fs.readFileSync(filepath, 'utf8');
    raw = JSON.parse(raw);

    raw.map((group) => {
        groupPool.push(new Group(group.groupLineId, group.rekt));
    })
    console.log(`[SYS] 已創立${groupPool.length}個Group Object`);
} catch (e) {
    console.log('[SYS] 無Group資料');
}

// save
function save() {
    let raw = [];
    groupPool.map((group) => {
        raw.push({
            groupLineId: group.groupLineId,
            rekt: group.rekt,
        });
    });

    fs.writeFileSync(filepath, JSON.stringify(raw), 'utf8');
}

module.exports = {
    save,
}