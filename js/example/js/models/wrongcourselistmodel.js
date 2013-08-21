/**
 * Date: 13-4-15
 * Time: 下午6:25
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var wrongCourseListModel = Backbone.Model.extend({
        defaults :{
            type : '数学',
            typeid : 2,
            list : [],
            secsum : 10,
            needreviewsecsum : 0
        }
    });

    return wrongCourseListModel;
});