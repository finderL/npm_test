/**
 * User: mh
 * Date: 13-4-15
 * Time: 下午4:00
 */
define(function(require, exports, module) {
    var wrong = null;
    var wrongsView = require("../views/wrongsview");

    exports.init = function() {
        if (wrong) {
            wrong.remove();
        }
        wrong = new wrongsView();
        return wrong;
    }
});