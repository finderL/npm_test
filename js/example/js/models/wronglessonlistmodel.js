/**
 * Date: 13-4-15
 * Time: 下午6:44
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var wrongLessonListModel = Backbone.Model.extend({
        defaults :{
            data : [{
                needreviewnum : "0",
                sectionnum : 1,
                lessonguid : "81316",
                salesguid : "s10976",
                lessonname : "第三讲 三角函数的图像变换"
            }],
            success : true
        }
    });

    return wrongLessonListModel;
});