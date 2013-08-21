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

    var exerciseListModel = Backbone.Model.extend({
        defaults :{
            filepath: "",
            guid:"",
            id:"",
            scid:"",
            secid:'',
            sectionanswer:"",
            sectiontitle:"",
            itemSrc : ''
        },
        initialize : function() {
            this.set("itemSrc",this.get("filepath") + this.get("sectiontitle"));
        }
    });

    return exerciseListModel;
});