/**
 * 课程数据集合
 * User: shy
 * Date: 13-4-7
 * Time: 上午11:09
 * 课程的列表，我的课程，免费课等的展示
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var courseListModel = require('../models/courselistmodel');

    var courseCollection = Backbone.Collection.extend({
        model : courseListModel,
        url : "/api/my/courses/",
        initialize : function () {
//            alert("课程集合初始化成功 。。 1");
        }
    })

    return courseCollection;

});
