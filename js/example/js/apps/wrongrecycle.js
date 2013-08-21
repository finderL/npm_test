/**
 * Date: 13-5-15
 * Time: 下午9:14
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var wrongsRecycle = require("../views/wrongsrecycleview");

    exports.init = function() {
        return new wrongsRecycle();
    }
});