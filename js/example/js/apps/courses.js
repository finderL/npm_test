define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var courseView = require("../views/coursesview");
    var otherCourseView = require("../views/othercourseview");
    var allCourseTypes = ['free/', 'experience/', 'personality/', 'direct/', 'easycash/'];

    exports.init = function(courseType) {
        //非sale的课程列表
        if (_.indexOf(allCourseTypes, courseType) >= 0) {
            otherCourseView.init(courseType);
        } else {
            courseView.init(courseType);
        }

    }
});

