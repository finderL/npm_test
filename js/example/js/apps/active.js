/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-6-24
 * Time: 下午5:10
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var active = require('../views/activeview');
    var myactive = null;
    exports.init = function() {
        if (myactive) {
            myactive.remove();
        }
        myactive = new active();
        return myactive;
    }
});