/**
 * 练习数据模型
 * User: shy
 * Date: 13-4-7
 * Time: 上午10:58
 * 练习功能数据
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var practiceModel = Backbone.Model.extend({
        defaults :{
            "sectiontitle":"",
            "sectionanswer":"",
            "filepath":"images/courseimages/",
            "guid":"",
            "scid":"",
            "secid":"",
            "ssid":""
        }
    });

    return practiceModel;
});