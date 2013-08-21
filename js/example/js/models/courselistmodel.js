/**
 * 我的课程列表数据模型
 * User: shy
 * Date: 13-4-7
 * Time: 上午10:58
 * 页面展示“我的课程”的课程需要显示的内容
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var courseListModel = Backbone.Model.extend({
        defaults :{
            subject : 1,
            name : 'default',
            publishState : 0,
            year : '',
            grade : '',
            lastListenTime : '2012-01-10',
            lastModifyTime : '2012-01-10',
            openTime : '2012-01-10',
            closeTime : '2012-01-10'
        }
    });

    return courseListModel;
});