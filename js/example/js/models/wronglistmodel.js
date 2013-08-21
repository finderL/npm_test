/**
 * Date: 13-4-15
 * Time: 下午6:31
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var wrongListModel = Backbone.Model.extend({
        defaults :{
            scid : "d4666",  //lessonId
            secid : "57025",  //错题Id
            samesectionid : "55187",  //练习错题无此Id
            samesectiondata : null,  //同类题
            type : "错题",
            easylevel : "",
            istitle : true,  //是否有题面
            imagepathtitle : "images/cqaimages/1/167/108394_q.jpg",  //错题题面
            imagepathkey : "images/cqaimages/1/167/108394_a.jpg",  //错题答案
            adddate : "2013-04-11",
            listtype : 0  //0-错题列表，1-回收站列表
        },

        urlRoot: '/api/wrongbook/wrongbookdata'
    });

    return wrongListModel;
});