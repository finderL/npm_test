/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-3-29
 * Time: 下午4:24
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var sectionModel = require('../models/sectionmodel');

    var sectionCollection = Backbone.Collection.extend({
        model : sectionModel
    })

    return sectionCollection;
});