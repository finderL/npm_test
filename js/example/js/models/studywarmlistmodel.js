/**
 * 我的课程列表数据模型
 * User: liubei
 * Date: 13-6-20
 * 学习中心学习提醒
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var studyWarmModel = Backbone.Model.extend({
        defaults :{
            remind :[]
        },
        parseData : function(response, options){
            var a = [];
            if( response.length != 0){
                for(var i = 0; i<response.repeat.length; i++){
                    a.push(response.repeat[i])
                }
                for(var key in response.single){
                    a.push(response.single[key])
                }
                this.set("remind", a);
            }
            return this;
        }
    });

    return studyWarmModel;
})