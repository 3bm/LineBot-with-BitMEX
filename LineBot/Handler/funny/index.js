const wrapper = require('../wrapper.js');
module.exports = new wrapper(/(.+)/ug, funny);

const magicConch = require('./magicConch'),
    getOnTheBus = require('./getOnTheBus');

function funny(event, matchedStr) {
    // if matched, is true
    magicConch.test(event, matchedStr) ||
        getOnTheBus.test(event, matchedStr);
}