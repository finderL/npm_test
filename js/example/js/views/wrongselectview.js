/**
 * Date: 13-4-22
 * Time: 上午11:12
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var templates = require("../../html/wrongcourselist.html");

    var wrongSelectView = Backbone.View.extend({
        tagName: "div",
        className: "wb-nav-subject",
        template : _.template(templates),
        initialize : function(data, courses) {
            this.data = data;
            this.courses = courses;
        },
        render : function() {
            this.renderWrongSubjects(this.data);
            return this;
        },

        renderWrongSubjects : function(subjectData){
            var that = this;
            subjectData.courses = this.courses;
            that.$el.append(_.template(templates, subjectData));
        }
    });

    return wrongSelectView;
});