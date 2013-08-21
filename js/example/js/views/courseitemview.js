/**
 * 正式课程在列表中的模板
 * User: shy
 * Date: 13-4-7
 * Time: 上午11:28
 * 在 我的课程 中 每个单独的课程页面的模板
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var templates = require("../../html/courseitem.html");

    var courseItemView = Backbone.View.extend({
        tagName: "div",
        className: "course",
        template : _.template(templates),
        initialize : function() {
            this.render();
        },
        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    return courseItemView;
});
