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
    var homeOnlineLiveModel = Backbone.Model.extend({
        defaults :{
            alt:"",
            href:""
        },
        urlRoot: "/api/home/onlinelive/",
        initialize : function() {
        }
    });

    return homeOnlineLiveModel;
});