/**
 * Date: 13-5-15
 * Time: 下午9:16
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var templates = require("../../html/recyclewrongbook.html");
    var wrongItemView = require("./wrongitemview");
    var wrongPaging = require("../components/paging");

    var wrongsRecycleView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            this.render();
        },

        template : _.template(templates),
        events : {
            "mouseenter #J_wrongBookDisplayRecycle li" : "displayAction",
            "mouseleave #J_wrongBookDisplayRecycle li" : "hideAction"
        },

        render : function() {
            var that = this;
            this.$el.html(this.template);

            this.wrongsRecyclePaging = new wrongPaging(
                "/api/wrongbook/wrongbookdata/",
                "",
                10,
                ".ui-paging",
                "#J_noWrongBookRecycle",
                "#J_wrongBookDisplayRecycle",
                displaywrongbookCallBack
            );
            this.renderWrongs();

            function displaywrongbookCallBack(obj){
                var pageData = obj._current_data;
                var data = [];
                for (var key in pageData) {
                    if(key != 'length') {
                        var item = pageData[key];
                        item.listtype = 1;
                        data.push(item);
                    }
                }
                var wrongList = new wrongItemView(data);
                $("#J_wrongBookDisplayRecycle").html("").append(wrongList.render().$el.html());
                $(".j_restoreWrongBook").on("click", null, that, that.restoreWrongBook);
            }
        },

        renderWrongs : function() {
            this.wrongsRecyclePaging.del_cache_data();
            this.getWrongData(3, 0, -1, 2);
        },

        getWrongData : function(type, isNeeded, idByType, wbType){
            var requireDataString = (
                "type=" + type             //请求类型
                    + "&isneeded=" + isNeeded
                    + "&idbytype=" + idByType   //科目类型
                    + "&wbtype=" + wbType       //错题来源
                    + "&rnd=" + Math.round(Math.random() * 1000000000, 1)
                    + "&index="
                );

            this.wrongsRecyclePaging.set_request_param(requireDataString);
            this.wrongsRecyclePaging.showPage(0, isNeeded);
        },

        displayAction : function(e){
            $(e.currentTarget).addClass("ui-topic-hover");
        },

        hideAction : function(e){
            $(e.currentTarget).removeClass("ui-topic-hover");
        },

        restoreWrongBook : function(e) {
            var sId = $(e.currentTarget).attr("sid");
            var sameId = $(e.currentTarget).attr("same");
            var ajaxParam = {
                type: "PUT",
                url: "/api/wrongbook/deleterecord/",
                data: "delete=0&sectionguid=" + sId + "&samesectionguid=" + sameId + "&rnd=" + Math.round(Math.random() * 1000000000, 1),
                dataType: "json",
                success : function(data, status) {
                    e.data.renderWrongs();
                }
            };
            $.ajax(ajaxParam);
        }
    });

    return wrongsRecycleView;
});
