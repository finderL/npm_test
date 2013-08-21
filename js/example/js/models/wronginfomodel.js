/**
 * Date: 13-4-24
 * Time: 下午6:08
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var wrongInfoModel = Backbone.Model.extend({
        defaults :{
            scid : "s13161",
            secid : "202461",
            samesectionid : "88430",
            imagepathtitle : "images/cqaimages/3/33/205185_q.jpg",
            imagepathkey : "images/cqaimages/",
            samecount : 0,
            isfreeuser : 1, //1-免费用户,0-正式用户
            pre : 1, //0-没有上一题，1-有上一题
            presecid : "204095",
            presamesectionid : "88402",
            next : 1, //0-没有下一题，1-有下一题
            nextsecid : "202448",
            nextsamesectionid : "88424",
            commenttype : 0
        },

        urlRoot: "/api/wrongbook/wrongsectioninfo/"
    });

    return wrongInfoModel;
});
