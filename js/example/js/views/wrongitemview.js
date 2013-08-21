/**
 * Date: 13-4-16
 * Time: 下午7:08
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var wrongListCollection = require("../collections/wronglist");
    var templates = require("../../html/wronglist.html");

    var wrongItemView = Backbone.View.extend({
        tagName: "li",
        template : _.template(templates),
        initialize : function(data) {
            this.collection = new wrongListCollection(data);
            return this;
        },
        render : function(urlParam) {
            var that = this;
            _.each(this.collection.models, function (item, index) {
                that.$el.append(_.template(templates, item.toJSON()));
                if(urlParam) {
                    var reviewUrl = that.$el.find(".j_reviewWrongBook").eq(index).attr("href");
                    that.$el.find(".j_reviewWrongBook").eq(index).attr("href", reviewUrl + urlParam);
                }
            });
            return this;
        }
    });

    return wrongItemView;
});
