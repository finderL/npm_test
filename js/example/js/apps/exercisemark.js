define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var exercisemarkview = require("../views/exercisemark");
    var exercisemark = null;
    exports.init = function() {
        if (exercisemark) {
            exercisemark.remove();
        }
        exercisemark = new exercisemarkview();
        return exercisemark;
    }
});

