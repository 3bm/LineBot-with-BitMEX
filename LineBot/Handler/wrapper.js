// wrapper of handler
// match => exec cb() & return T
// no match => return F
module.exports = function (Regexp, cb) {
    this.Regexp = Regexp;
    this.cb = cb;
    this.test = function (lineEvent, str) { // str:欲與this.Regexp比較的字串
        var tmp = this.Regexp.exec(str);
        this.Regexp.lastIndex = 0; // reset lastIndex for next action
        if (tmp !== null) {
            cb(lineEvent, tmp[1]);
            return true;
        }
        return false;
    }
}
