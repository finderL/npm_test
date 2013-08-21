/**
 * 错题数据集合
 * Date: 13-4-16
 * Time: 上午11:19
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var wrongListModel = require('../models/wronglistmodel');

    var wrongListCollection = Backbone.Collection.extend({
        model : wrongListModel,
        initialize : function () {
            //alert("错题集合初始化成功");
        }
    })

    return wrongListCollection;

});
