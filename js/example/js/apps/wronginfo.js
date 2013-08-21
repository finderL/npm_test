/**
 * Date: 13-4-25
 * Time: 下午3:53
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var wrongInfoModel = require('../models/wronginfomodel');
    var wrongInfoView = require("../views/wronginfoview");
    var popWindow = require("../components/popup");

    exports.init = function() {
        return new wrongInfoView;
    };
});