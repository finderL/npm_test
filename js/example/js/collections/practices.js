/**
 * 练习数据集合
 * User: shy
 * Date: 13-4-7
 * Time: 上午11:09
 * 练习功能列表
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var practiceModel = require('../models/practicemodel');

    var practiceCollection = Backbone.Collection.extend({
        model : practiceModel
    })

    return practiceCollection;

});
