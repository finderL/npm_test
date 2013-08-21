/**
 * Created with JetBrains PhpStorm.
 * User: eric
 * Date: 13-7-1
 * Time: 上午10:26
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var homeBaseInfoModel = Backbone.Model.extend({
        defaults :{
            easyCash:"",
            data:"",
            face:""//默认头像
        },
        urlRoot: "/api/home/myinfo/",
        initialize : function() {
        }
    });

    return homeBaseInfoModel;
});