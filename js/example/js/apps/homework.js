define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var homeworkview = require("../views/homeworkview");
    var homework = null;
    exports.init = function() {
        if (homework) {
            homework.remove();
        }
        homework = new homeworkview();
        return homework;
    }
});

