/**
 * Created with JetBrains PhpStorm.
 * User: lijinsheng
 * Date: 13-6-28
 * Time: 下午6:18
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var myLogoModel = Backbone.Model.extend({
        defaults :{
            "is_reviewer":0,
            "user_figure":0,
            "logo_info":"/images/qa/stu_photo.png"
        },
        url : "/api/my/userinfo/getmylogo/"
    });

    return myLogoModel;
});