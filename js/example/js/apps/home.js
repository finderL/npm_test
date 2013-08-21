/**
 * Date: 13-6-20
 * Time: 下午4:46
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var homeView = require("../views/homeview");

    exports.init = function() {
        return new homeView();
    }
});
