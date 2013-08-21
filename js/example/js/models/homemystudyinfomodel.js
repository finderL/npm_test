/**
 * Created with JetBrains PhpStorm.
 * User: eric
 * Date: 13-7-1
 * Time: 下午4:52
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var homeMyStudyInfoModel = Backbone.Model.extend({
        defaults :{
            data:""
        },
        urlRoot: "/api/home/mystudyinfo/",
        initialize : function() {
        }
    });

    return homeMyStudyInfoModel;
});