const wrapper = require('../../wrapper.js');
const fs = require('fs');
module.exports = new wrapper(/^debug$/ig, debug);

async function debug(event, debug) {
    if (event.source.userId == 'sssssss') { // for admin
        fs.writeFileSync('./debug.log', JSON.stringify(global.userPool), 'utf8');
    }
}