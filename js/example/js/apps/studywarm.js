define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var studywarmview = require("../views/studywarmview");
    var studywarm = null;
    exports.init = function() {
        if (studywarm) {
            studywarm.remove();
        }
        studywarm = new studywarmview();
        return studywarm;
    }
});

