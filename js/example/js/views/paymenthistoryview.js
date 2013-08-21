/**
 * Date: 13-6-24
 * Time: 下午4:25
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var viewTemplates = require("../../html/paymenthistory.html");
    var Paging = require("../components/paging");

    var paymentHistoryView = Backbone.View.extend({
        el : "#content",
        template : _.template(viewTemplates),

        initialize : function() {
            this.render();
        },

        render : function() {
            var that = this;
            this.$el.html(this.template());

            var requireDataString = (
                "rnd=" + Math.round(Math.random() * 1000000000, 1)
                    + "&index="
                );
            this.paymentPaging = new Paging(
                "/api/my/pay/",
                requireDataString,
                15,
                ".ui-paging",
                "#J_noPayhistory",
                "#payHistory",
                function(obj){
                    obj._renderContent("#payhistoryContent");
                }
            );
            this.paymentPaging.showPage(0);
        }
    });

    return paymentHistoryView;
});

