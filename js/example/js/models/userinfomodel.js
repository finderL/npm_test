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

    var userInfoModel = Backbone.Model.extend({
        defaluts : {
            username : '',
            userFigure : 0,
            userinfo : []
        },
        url : '/api/my/userinfo/getuserinfo/'

    });
    return userInfoModel;
});