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
    var cookie = require('cookie');
    var Popup = require("../components/popup.js");
    var templates = require("../../html/myexercise.html");
    var exerciseItemTemplate = require("../../html/exerciseitem.html");
    var exerciseList = require("../collections/exercises");
    var Page = require("../components/paging");
    var CutTips = require("../components/display_ellipsis.js");
    var myexercises = new exerciseList([],{url:'/api/exercise/Listenedandnotexercise/'});

    var exerciseView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            var that = this;
            this.isListened = false;
            this.requestNum = 0;
            this.isFull = false;
            this.isClickedNo = true;
            $("#ex_display").html("");
            this.listenTo(myexercises, 'add', this.renderOne);
            this.listenTo(myexercises, 'reset', this.renderAll);
            this.subjectDatas = [];
            this.lessonDatas = [];
            this.sectionDatas = [];
            this.render();
            this.popup();
            this.subjecDatas = [];
            this.isPopupNo = true;
            this.pview = null;
            $("#content").undelegate("a.j_showComment", "click");
            $("#content").delegate("a.j_showComment", "click", this.showComment);
            myexercises.fetch({reset : true, data: {index:0,count:5}});
            $(window).scroll(function () {
                if (($(window).height() + $(window).scrollTop() >= $('body').height() - 10) && !that.isFull) {
                    that.scroollIt();
                }
            });

        },
        template : _.template(templates),
        events : {
            "mouseenter .ex-detail-list-con" : "enter",
            "mouseleave .ex-detail-list-con" : "leave",
            "click ul.j_exerciseTab li.ui-tab-item" : "clickIt",
            "click #prompt .ui-icon-close" : "closePrompt",
            "click #J_promptKnow" : "closePrompt"

        },

        getLessons : function (e){
            var $me = $(e.target);
            var realguid = $me.attr("realguid");
            var authtype = $me.attr("authtype");
            var courseguid = $me.attr("courseguid");
            var selectModel = require('../models/wrongselectmodel');
            var selectLessoneData = new selectModel();
            selectLessoneData.set('type', "2");
            selectLessoneData.fetch({
                url: '/api/exercise/exerciselesson/',
                data: $.param({"realguid": realguid,
                    "courseguid":courseguid,
                    "authtype":authtype}),
                success: function(model, response, options){
                    model.parseData(response);
                    var lesson = model.get("lessondata");
                    (function displayLessons(lesson) {
                        $me.parent().addClass("current").siblings().removeClass("current");
                        var cid = $me.attr("alt-value");
                        //var currentCourses = [];
                        $(".ex_lesson ul").html("");
                        $(".ex_section_con ul").html("");
                        if(  !$(".ex_section_con ul").next(".textcenter").hasClass("fn-hide") ){
                            $(".ex_section_con ul").next(".textcenter").addClass("fn-hide");
                        }
                        _.each(lesson, function(lessonItem) {
                                //currentCourses.push(courseItem);
                                $(".ex_lesson ul").append("<li><a href='javascript:void(0);' alt-value='"+lessonItem.guid+"'>" +lessonItem.lessonName + "</a><s></s></li>");
                        });

                    })(lesson);
                    CutTips.init({"targetObj":".ex_lesson ul a","numLimited":23});
                    $(".ex_lesson ul").off("click", "li a");
                    $(".ex_lesson ul").on("click", "li a", e.data, e.data.getSection);
                },
                error: function(){
                    alert("error");
                }
            });
        },

        getSection : function (e){
            $(".ex_section_con ul").html("");
            var $me = $(e.target);
            var lessonguid = $me.attr("alt-value").toString();
            var selectModel = require('../models/wrongselectmodel');
            var selectLessoneData = new selectModel();
            selectLessoneData.set('type', "3");
            selectLessoneData.fetch({
                url: '/api/exercise/exercisesection/',
                data: $.param({"lessonguid": lessonguid}),
                success: function(model, response, options){

                    if( response.success === true ){
                        $(".ex_section_con ul").next(".textcenter").addClass("fn-hide");
                        if( response.data.length > 0 ){
                            model.parseData(response.data,lessonguid);
                            var sections = model.get("section");
                            (function displaysections(sections) {
                                $(e.currentTarget).parent().addClass("current").siblings().removeClass("current");
                                $(".ex_section_con ul").html("");

                                _.each(sections, function(sectionItem) {
                                    if( lessonguid == sectionItem.lessonGuid){
                                        //currentCourses.push(courseItem);
                                        $(".ex_section_con ul").append("<li sectionId='"+sectionItem.sectionId+"' samesectiondata='"+sectionItem.samesectiondata+"' lessonguid='"+sectionItem.lessonGuid+"'><input type='checkbox' name='exerciseSection' checked=''><label for='"+sectionItem.lessonGuid+"'>" +sectionItem.sectionname + "</label></li>");
                                    }
                                    if(  $(".ex_section_con ul").next(".textcenter").hasClass("fn-hide") && lessonguid == sectionItem.lessonGuid){
                                        $(".ex_section_con ul").next(".textcenter").removeClass("fn-hide");
                                    }

                                });

                            })(sections);
                        } else {
                            $(".ex_section_con ul").html("").append("<li>没有习题</li>");
                        }
                    }else{
                        alert("获取数据失败,请稍后再试!");
                    }
                    CutTips.init({"targetObj":"#exerciseSection label","numLimited":24});
                },
                error: function(){
                    alert("error");
                }
            });
        },

        scroollIt : function (){
            var that = this;
            this.requestNum += 5;
            myexercises.fetch({data: {index:this.requestNum,count:5}, success :function(collection, response, options) {
                if (!response.success) {
                    $("#more_items").removeClass("fn-hide");
                    that.isFull = true;
                }
            }});
        },

        popup : function (){
            var that = this;
            $("body").off("click", ".wb-nav-select-trigger");
            $("body").off("mouseenter", ".wb-nav-select-trigger");
            var t1 = new Popup({
                trigger : ".wb-nav-select-trigger",
                popupBlk : "#selectSection",
                closeBtn : ".j_exercisePopClose a",
                eventType : "click",
                useOverlay : true,
                isCentered : true,
                isDrag : true,
                onBeforeStart : function(){

                },
                onAfterPop: function(){

                    $(".ex_course ul").html("");
                    $(".ex_lesson ul").html("");
                    $(".ex_section_con ul").html("");
                    $(".ex_section_con ul").next(".textcenter").addClass("fn-hide");
                    var selectModel = require('../models/wrongselectmodel');
                    var selectCourseData = new selectModel();
                    selectCourseData.set('type', "1");
                    selectCourseData.fetch({
                        url: '/api/exercise/exercisecourse/',
                        success: function(model, response, options){
                            model.parseData(response);
                            var subjects = model.get("subject");
                            var subjectType = subjects.subjecttype;
                            var sujectDataItem = {};
                            sujectDataItem = {lessondata : subjects};
                            that.subjecDatas.push(sujectDataItem);
                            $(".ex_subject ul").html("");
                            _.each(subjects, function(subjectItem) {
                                $(".ex_subject ul").append("<li><a href='javascript:void(0);' alt-value="+subjectItem.subjecttype+">" + subjectItem.subjectname +"</a></li>");
                            })
                            $(".ex_subject ul").on("click", "a", subjects, function(e) {
                                that.displayCourses(e);
                                $(".ex_course ul").off("click", "li a");
                                $(".ex_course ul").on("click", "li a", that, that.getLessons);
                            });

                        },
                        error: function(){
                            alert("error");
                        }
                    });
                    that.closePrompt();
                    var self = this;
                    $("body").on("click","#startButton",function(){
                        if( $(".ex_section_con ul li").length > 0 ){
                            var param = [];
                            var sections = [];
                            for( var i = 0 ; i <  $(".ex_section_con ul li input:checked").length ; i ++){
                                var sameid =  $(".ex_section_con ul li input:checked").eq(i).parent("li").attr("samesectiondata");
                                var curSectionid = $(".ex_section_con ul li input:checked").eq(i).parent("li").attr("sectionid");
                                var tempArr = sameid.split(",");
                                _.each(tempArr, function(temp) {
                                    if ( !sections[temp] ) {
                                        sections[temp] = curSectionid;
                                    }
                                })
                                param = param + sameid +",";
                            }
                        }
                        that.showPracticeAll(param, sections, self);
                        that.isClickedNo = false;
                    });
                }
            });

        },

        showComment : function (e){
            var $me = $(e.currentTarget);
            var $parent = $me.parents(".ex-detail-list-con");
            var sectionguid = $me.parents("li").attr("sectionguid");
            var samesectionguid = $me.parents("li").attr("samesectionguid");
            var params ='sectionguid='+sectionguid+'&samesectionguid='+samesectionguid+'&ismyself=0&type=1&length=5&index=';
            var noContentDisplay = "#section-commit-"+sectionguid+"-"+samesectionguid+" p",
                displayContainer = "#section-commit-"+sectionguid+"-"+samesectionguid+" .wb-sub-comments-list";

            if( $parent.siblings(".wb-sub-comments-con").hasClass("fn-hide") ){
                var renderContent = function(data) {
                    var data = data._current_data;
                    $(displayContainer).html("");
                    for(var i = 0; i< data.length; i++){
                        $(displayContainer).append('<li class="ui-topic-hover"><div class="wb-sub-comments-user"><span>'+data[i].username+'</span><i>'+data[i].inserttime+'</i></div><p>'+data[i].commentcontent+'</p></li>');
                    }
                }
                if( !$parent.attr("load") ){
                    var page = new Page("/api/wrongbook/commentlist/",
                        params,
                        5,
                        "#section-commit-"+sectionguid+"-"+samesectionguid+" .ui-paging",
                        "#section-commit-"+sectionguid+"-"+samesectionguid+" p",
                        "#section-commit-"+sectionguid+"-"+samesectionguid+" .wb-sub-comments-list",
                        renderContent);
                    page.del_cache_data();
                    page.showPage(0);
                    $parent.attr("load",1);
                }

                $(".ex-detail-list-con").removeClass("dropdownHover");
                $(".wb-sub-comments-con").addClass("fn-hide");
                $parent.addClass("dropdownHover");
                $parent.siblings(".wb-sub-comments-con").removeClass("fn-hide");
            }else{
                page = null;
                $(".ex-detail-list-con").removeClass("dropdownHover");
                $(".wb-sub-comments-con").addClass("fn-hide");
            }
        },

        hideIt : function(){
            $.cookie('prompt','closed')
                $("#prompt").hide();
        },

        closePrompt : function (){
            $("#prompt").hide();
        },

        clickIt : function(e){
            if( !$(e.currentTarget).hasClass("ui-tab-item-current") ){
                var num = $(e.currentTarget).index(".ui-tab-item");
                $(e.currentTarget).addClass("ui-tab-item-current");
                $(e.currentTarget).siblings(".ui-tab-item").removeClass("ui-tab-item-current");
                $("#ex_display").html("");
                this.requestNum = 0;
                myexercises.url = (num == 0 ? '/api/exercise/Listenedandnotexercise/' : '/api/exercise/listened/');
                myexercises.fetch({reset: true,data: {index:0,count:5}});
            }else{
                return;
            }
        },

        enter : function(e) {
            if( !$(e.currentTarget).hasClass("ui-topic-hover") ){
                $(e.currentTarget).addClass("ui-topic-hover");
            }
        },

        leave : function(e) {
            if( $(e.currentTarget).hasClass("ui-topic-hover") ){
                $(e.currentTarget).removeClass("ui-topic-hover");
            }
        },

        displayCourses : function(e) {
            $(".ex_course ul").html("");
            $(e.currentTarget).parent().addClass("current").siblings().removeClass("current");
            var sid = $(e.currentTarget).attr("alt-value");
            $(".ex_course ul").html("");
            $(".ex_lesson ul").html("");
            $(".ex_section_con ul").html("");
            if(  !$(".ex_section_con ul").next(".textcenter").hasClass("fn-hide") ){
                $(".ex_section_con ul").next(".textcenter").addClass("fn-hide");
            }
            _.each(e.data, function(courseItem) {
                if(courseItem.subjecttype == sid) {
                    if( courseItem.list.length > 0 ){
                        for( var i = 0; i < courseItem.list.length; i++){
                            var course = courseItem.list[i];
                            $(".ex_course ul").append("<li><a href='javascript:void(0);' alt-value='"+courseItem.subjecttype+"' courseguid='"+course.guid+"' authtype='"+course.authtype+"' realguid='"+course.realguid+"'>" +course.coursename + "</a><s></s></li>");
                        }

                    }
                }
            });
            CutTips.init({"targetObj":".ex_course ul a","numLimited":24});
        },

        render : function() {
            var that = this;
            this.undelegateEvents();
            this.$el.html(this.template);
            $("#ex_display").html("");
            if( $.cookie('prompt') != undefined ){
                this.hideIt();
            }
        },

        renderOne : function(model) {
            var that = this;
            $("#ex_display").append(_.template(exerciseItemTemplate, model.toJSON()));
            var t2 = new Popup({trigger:".j_doOneExercise",
                popupBlk:"#J_exercisePop",
                closeBtn:".j_exercisePopClose a",
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

        showPractice : function(sectionguid, secid, popWindow) {
            var that = this;
            require.async("./practiceview", function(practiceView) {
                that.pview = new practiceView();
                that.pview.renderDom(".j_exercisePopDel",sectionguid, secid);
                that.pview.setThisToClose(popWindow);
            });
        },
        showPracticeAll : function(param, sectionids, popWindow) {
            var that = this;
            require.async("./practiceview", function(practiceView) {
                that.pview = new practiceView({el : "#selectSection"});
                that.pview.renderDom("", param, sectionids);
                //that.pview.setThisToClose(popWindow);
            });

        },

        closePview : function() {
            if(this.pview) {
                this.pview.stop();
            }
        },

        renderAll : function() {
            myexercises.each(this.renderOne, this);

        },
        remove: function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }

    });

    return exerciseView;
});