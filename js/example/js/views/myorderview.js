/**
 * Date: 13-6-24
 * Time: 下午2:58
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var cookie = require("cookie");
    var JSON = require("json");
    var viewTemplates = require("../../html/myorder.html");
    var Paging = require("../components/paging");
    var PopWindow = require("../components/popup");
    var orderCourseModel = require("../models/ordercoursemodel");
    var courseViewTemplates = require("../../html/ordercourselist.html");

    var myorderView = Backbone.View.extend({
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
            this.orderPaging = new Paging(
                "/api/my/order/getorderhistory/",
                requireDataString,
                15,
                ".ui-paging",
                "#J_noOrder",
                "#J_order",
                displayOrderCallBack
            );
            this.orderPaging.showPage(0);

            function displayOrderCallBack(obj){
                obj._renderContent("#J_orderContent");
                $("#J_orderContent").find(".stat0").html("未完成");
                $("#J_orderContent").find(".stat1").html("已完成");

                var myorderPop = new PopWindow({
                    trigger: ".j_myorder",
                    popupBlk: "#J_myorderPop",
                    closeBtn: "#J_myorderPopClose",
                    eventType : "click",
                    useOverlay : true,
                    isCentered : true,
                    isDrag : true,
                    onCloseCallBack : function() {
                        $("#orderCourseContent").html('');
                    },
                    onAfterPop : function(a, e) {
                        var orderid = $(e.currentTarget).attr("orderid");
                        var orderCourse = new orderCourseModel();
                        that.cur_order_id = orderid;

                        orderCourse.urlRoot += "?order_id=" + orderid;
                        orderCourse.fetch({success:function(model, response, options) {
                            that.cur_order_data = response.order_data;
                            $("#orderCourseContent").html(_.template(courseViewTemplates, response));

                            $("#genBuyCartInfo").unbind().click(function() {
                                $.cookie("CART_DATA", null, {path:'/'});
                                $.cookie("SUMPRICE", null, {path:'/'});
                                $.cookie("DISCOUNTPRICE", null, {path:'/'});
                                $.cookie("DISCOUNTSTYLE", null, {path:'/'});
                                $.cookie("ORDERID",null, {path:'/'});

                                cur_order_data = that.cur_order_data;
                                cur_order_id = that.cur_order_id;

                                var cart_data = new Array();
                                for(var i=0; i<cur_order_data.length; i++){
                                    var item = {guid:cur_order_data[i].course_guid,price:cur_order_data[i].price,link:cur_order_data[i].link,grade:cur_order_data[i].grade_code,type:cur_order_data[i].type};
                                    cart_data.push(item);
                                }
                                var serialize_cart_data = JSON.stringify(cart_data);

                                $.cookie("CART_DATA", serialize_cart_data, {expires:1, path:'/', raw:false});
                                $.cookie("ORDERID", cur_order_id, {expires:1, path:'/', raw:false});

                                window.location.href="/buycart/viewcart/";
                            });
                        }});
                    }
                });
            }

        }
    });

    return myorderView;
});
