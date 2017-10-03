const wrapper = require('../wrapper.js');
module.exports = new wrapper(/(.+)/ug, funny);

const magicConch = require('./magicConch');

function funny(event, matchedStr) {
    // if matched, is true
    magicConch.test(event,matchedStr);
}