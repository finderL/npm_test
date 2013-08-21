/**
 * 课程模块激活
 * User: sihuayin
 * Date: 13-6-28
 * Time: 上午10:16
 * 用户购买了课程以后，部分课程（模块课）需要用户自主选择课程
 */
define( function(require, exports, module) {
    var active = require("../views/activemoduleview");
    exports.init = function () {
        return new active();
    }
});
