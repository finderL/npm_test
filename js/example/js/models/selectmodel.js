/**
 * Created with JetBrains PhpStorm.
 * User: liu_bei
 * Date: 13-4-22
 * Time: 下午5:29
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var sectionModel = Backbone.Model.extend({
        defaluts : {
            subjects : []
        },
        initialize : function () {
            //alert("section start ..");
        }
    });

    return sectionModel;
});