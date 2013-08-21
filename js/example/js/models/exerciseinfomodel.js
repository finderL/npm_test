/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-3-29
 * Time: 上午9:55
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var exerciseInfoModel = Backbone.Model.extend({
        defaluts : {
            subjects : [{
                type: "",
                typeid: "",
                count: null,
                list: []
            }],
            courses:[{
                guid: "",
                coursename: "",
                realguid: "",
                authtype: null,
                lessondata: [],
                scid: ""
            }],
            lessons : [{
                guid: "",
                lessonName : "",
                scid : null,
                sectiondata: []
            }],
            sections : [{
                guid: "",
                lessonguid: "",
                sectionname: "",
                samesectiondata: ""
            }]
        },



        initialize : function() {
            alert(this.id);
        }
    });
    exports.init = function() {
        return new exerciseInfoModel;
    }
});