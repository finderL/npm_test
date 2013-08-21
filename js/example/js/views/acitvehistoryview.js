/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-7-3
 * Time: 下午5:47
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var JSON = require("json");
    var Page = require("../components/paging");
    var templates = require("../../html/activehistory.html");




    var activeHistoryView = Backbone.View.extend({
        el : "#content",
        template :_.template(templates),
        initialize : function () {
            this.render();


        },

        render : function() {
            this.$el.html(this.template({}));
            var page = new Page(
                "/api/my/active/activehistory/",
                "",
                10,
                ".ui-paging",
                "#J_noActiveHistory",
                "#J_activeHistory",
                this.renderData
            );
            page.showPage(0);
        },

        renderData : function (obj) {
            var data = obj._current_data;
            $("#J_activeHistory tbody").html("");
            if (data.length > 0) {
                for (var i = 0, len = data.length; i < len; i ++ ) {
                    if (data[i].activecode) {
                        var tempHtml = "<tr><td> " + data[i].activecode + "</td>  <td width='30%'>" +data[i].inserttime+"</td></tr>";
                        $("#J_activeHistory tbody").append(tempHtml);
                    }

                }
            }
        }
    });
    return activeHistoryView;
});

