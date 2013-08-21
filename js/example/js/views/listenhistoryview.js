/**
 * 课程列表页面
 * User: shy
 * Date: 13-4-7
 * Time: 下午12:07
 * 各种课程的页面展示
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Popup = require("../components/popup.js");
    var templates = require("../../html/listenhistory.html");
    var historyItemTemplate = require("../../html/listenhistoryitem.html");
    var Page = require("../components/paging");
    var listenHistory = [
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"},
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"},
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"},
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"},
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"},
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"},
        {dateTime : "2013-06-20 00:00",
            lectureName :"高中免费课",
            lessonName :"英语:阅读技巧一(高中英语阅读理解集训课程)",
            startTime : "2013-06-20 00:00",
            endTime : "2013-06-20 00:00",
            duration : "4 分钟"}
    ];

    var exerciseView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            var that = this;
//            this.listenTo(myexercises, 'add', this.renderOne);
//            this.listenTo(myexercises, 'reset', this.renderAll);
            this.render();
        },
        template : _.template(templates),
        events : {
            "mouseenter .ex-detail-list-con" : "enter",
            "mouseleave .ex-detail-list-con" : "leave",
            "click li.ui-tab-item" : "clickIt",
            "click #prompt .ui-icon-close" : "closePrompt",
            "click #J_promptKnow" : "closePrompt"

        },

        render : function() {
            var that = this;
            this.undelegateEvents();
            this.$el.html(this.template);
            _.each(listenHistory, function(item){
                $("#listenHistory tbody").append(_.template(historyItemTemplate, item));
            });
        },

        renderOne : function(model) {
            var that = this;
            $("#ex_display").append(_.template(exerciseItemTemplate, model.toJSON()));
            var t2 = new Popup({trigger:".ui-button-sblue",
                popupBlk:".pop_new_p",
                closeBtn:".popclose2 a",
                eventType:"click",
                useOverlay:true,
                isCentered:true,
                isDrag:true,
                onAfterPop : function(c, e){
                    var $target = $(e.target)
                    var sectionguid = $target.parents("li").attr("id");
                    var secid = $target.parents("li").attr("sectionguid");
                    that.showPractice(sectionguid, secid, this);
                    that.closePrompt();
                },
                onCloseCallBack : function() {
                    that.closePview();
                }
            })
        },

        renderAll : function() {
            myexercises.each(this.renderOne, this);

        }

    });

    return exerciseView;
});