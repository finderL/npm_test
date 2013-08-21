/**
 * Date: 13-4-15
 * Time: 下午4:47
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var cookie = require("cookie");
    var templates = require("../../html/wrongbook.html");
    var wrongItemView = require("./wrongitemview");
    var wrongSelectModel = require("../models/wrongselectmodel");
    var slide_menus = require("../components/slide_menus");
    var toggle_tab = require("../components/toggle_tab");
    var wrongPaging = require("../components/paging");
    var wrongSelectView = require("./wrongselectview");

    var wrongsView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            var that = this;
            this.type = 5; //请求类型：5-全部，4-课程，3-回收站，2-科目，1-lesson
            this.isNeeded = 1; //1-未复习错题，0-所有错题
            this.idByType = -1; //请求数据ID，无ID则为-1
            this.wbType = 2; //请求类型：2-全部错题，1-练习错题，0-课程错题
            this.needViewCount = 0; //需要复习的错题数
            this.totalCount = 0; //所有错题数
            this.subjectDatas = [];
            this.lessonDatas = []; //lesson数据缓存
            this.wrongBookPaging = {};

            this.toGetLesson = function(){
                var $self = arguments[0];
                var newArray = $self.find("a").attr("type").split("-");
                var subjectId = newArray[1].toString();
                var courseId = newArray[2].toString();
                that.getLesson(that, subjectId, courseId);
            };

            this.toGetIsNeededWrongData = function(){
                var $self = arguments[0];
                that.isNeeded = $self.attr("type");
                that.wrongBookPaging.del_cache_data();
                that.getWrongData(that.type, that.isNeeded, that.idByType, that.wbType);
            };

            this.getURL();
        },

        template : _.template(templates),
        events : {
            "mouseenter #J_wrongBookDisplayAll li" : "displayAction",
            "mouseleave #J_wrongBookDisplayAll li" : "hideAction",
            "click .j_sort li a" : "getSortData",
            "click .wb-nav-select-trigger" : "initWrongs",
            "click #J_wbCrumbs a" : "getCrumbs"
        },

        render : function() {
            var self = this;
            this.$el.html(this.template());
            this.getCourseData(this.wbType);
            this.wrongBookPaging = new wrongPaging(
                "/api/wrongbook/wrongbookdata/",
                "",
                10,
                ".ui-paging",
                "#J_noWrongBookAll",
                "#J_wrongBookDisplayAll",
                displaywrongbookCallBack
            );
            this.wrongBookPaging.del_cache_data();
            this.getWrongData(this.type, this.isNeeded, this.idByType, this.wbType);
            this.showPrompt();

            slide_menus.init({targetElement:".wb-nav-select-trigger", parentElement:".wb-nav-select", childElement:".wb-nav-items", currentName:".dropdownHoverFirst", eventType:"mouseenter"});

            slide_menus.init({targetElement:".wb-nav-subject h3", parentElement:".wb-nav-subject", childElement:".wb-nav-course", currentName:".dropdownHover", eventType:"mouseenter"});

            slide_menus.init({targetElement:".wb-nav-course-til", parentElement:".wb-nav-course li", childElement:".wb-nav-lesson", currentName:".dropdownHover", eventType:"mouseenter", callback : this.toGetLesson});

            slide_menus.init({targetElement:".j_dropdownSort", parentElement:".wb-sort-select", childElement:".j_sort", currentName:".dropdownHover", eventType:"mouseenter"});

            toggle_tab.init({tabName:".j_wrongBookTab .ui-tab-item", noContent:true, currentName:".ui-tab-item-current", eventType:"click", callback: this.toGetIsNeededWrongData});

            function displaywrongbookCallBack(obj){
                var pageData = obj._current_data;
                var data = [];
                for (var key in pageData) {
                    if(key != 'length') {
                        var item = pageData[key];
                        item.listtype = 0;
                        data.push(item);
                    }
                }
                if(self.isNeeded == 0){
                    self.totalCount = self.wrongBookPaging._allCount;
                }
                else {
                    self.needViewCount = self.wrongBookPaging._allCount;
                }
                var urlParam = "&t=" + self.type + "&isneeded=" + self.isNeeded + "&idbytype=" + self.idByType + "&wbtype=" + self.wbType;
                var wrongList = new wrongItemView(data);
                $("#J_wrongBookDisplayAll").html("").append(wrongList.render(urlParam).$el.html());
                $("#J_needReviewCount").html("(" + self.needViewCount + ")");
                $("#J_allCount").html("(" + self.totalCount + ")");
            }

            if(this.isNeeded == 0) {
                $(".ui-tab-item").eq(0).removeClass("ui-tab-item-current")
                $(".ui-tab-item").eq(1).addClass("ui-tab-item-current");
            }
            $("#J_wrongBookDisplayAll").on("click", ".J_delete", this, this.deleteItem);
        },

        getURL : function() {
            var that = this;
            var url = (window.location.hash).split("?");
            if(url[1] != undefined) {
                var urlparam = url[1].split("&");
                that.idByType = (urlparam[0].split("="))[1];
                that.type = (urlparam[1].split("="))[1];
                that.isNeeded = (urlparam[2].split("="))[1];
                that.wbType = (urlparam[3].split("="))[1];

                this.render();

                var subjectId = "";
                var courseId = "";
                if(urlparam.length == 4) {
                    setTimeout( function () {
                        that.renderPathData(that.idByType, null, null);
                    }, 100);
                }
                if(urlparam.length == 5) {
                    subjectId = (urlparam[4].split("="))[1];
                    setTimeout( function () {
                        that.renderPathData(subjectId, that.idByType, null);
                    }, 100);
                }
                if(urlparam.length == 6) {
                    subjectId = (urlparam[4].split("="))[1];
                    courseId = (urlparam[5].split("="))[1];
                    this.getLesson(that, subjectId, courseId, (function() {
                        setTimeout( function () {
                            that.renderPathData(subjectId, courseId, that.idByType);
                        }, 100);

                    })
                    );
                }

                if(that.wbType == 0) {
                    $(".j_dropdownSort").html('课程错题<em class="ui-icon-triangle-dropdown"></em>');
                }
                if(that.wbType == 1) {
                    $(".j_dropdownSort").html('练习错题<em class="ui-icon-triangle-dropdown"></em>');
                }
            }
            else {
                this.render();
            }
        },

        renderWrongCourses : function (models) {
            var that = this;
            var needViewCount = 0;
            var totalCount = 0;
            var wrongSubject = models.get('subject');
            var wrongCourse = models.get('course');
            $(".wb-nav-items").html("");
            _.each(wrongSubject, function(subjectItem) {
                var currentCourses = [];
                _.each(wrongCourse, function(courseItem) {
                    if(courseItem.subjecttype == subjectItem.subjecttype) {
                        currentCourses.push(courseItem);
                    }
                });
                var myWrongView = new wrongSelectView(subjectItem, currentCourses);
                needViewCount += subjectItem.isreview;
                totalCount += subjectItem.num;
                $(".wb-nav-items").append(myWrongView.render().$el.html());
            });
            this.needViewCount = needViewCount;
            this.totalCount = totalCount;
            if(this.needViewCount == 0 || this.totalCount == 0){
                $("#J_needReviewCount").html("(" + this.needViewCount + ")");
                $("#J_allCount").html("(" + this.totalCount + ")");
            }
        },

        getCourseData : function(type){
            var that = this;
            var wrongSelectData = new wrongSelectModel();
            wrongSelectData.fetch({
                url: '/api/wrongbook/wrongcourse/',
                data: $.param({wbtype: type}),
                success: function(model, response, options){
                    that.renderWrongCourses(model.useData(response));
                    that.subjectDatas = model.get("subject");
                    that.courseDatas = model.get("course");
                    $(".wb-nav-subject h3 a").on("click", "" , that, that.getSubjectPath);
                    $(".wb-nav-course-til a").on("click", "" , that, that.getCoursePath);
                },
                error: function(){
                    alert("error");
                }
            });
        },

        getLesson : function(that, subjectId, courseId, callback){
            var hasValue = false;
            if(that.lessonDatas.length != 0) {
                var lessonDataItemLesson = [];
                _.each(that.lessonDatas, function(lessonDataItem){
                    if(lessonDataItem.subjectid == subjectId){
                        hasValue = true;
                        lessonDataItemLesson = lessonDataItem.lessondata;
                    }
                });

                if (hasValue) {
                    renderWrongLesson(lessonDataItemLesson, subjectId, courseId);
                } else{
                    getLessnData(that, subjectId, courseId, callback);
                }
            }
            else{
                getLessnData(that, subjectId, courseId, callback);
            }

            function getLessnData(that, subjectId, courseId, callback){
                var wrongSelectLessonData = new wrongSelectModel();
                wrongSelectLessonData.set("type", "1");
                wrongSelectLessonData.fetch({
                    url: "/api/wrongbook/wronglesson/",
                    data: $.param({wbtype: that.wbType, subjectid: subjectId}),
                    success: function(model, response, options){
                        model.useData(response);
                        var lessonDataItem = {};
                        lessonDataItem = {subjectid : subjectId, lessondata : model.get("lesson")};
                        that.lessonDatas.push(lessonDataItem);
                        renderWrongLesson(model.get("lesson"), subjectId, courseId);
                        if(callback) {
                            callback();
                        }
                    },
                    error: function(){
                        alert("error");
                    }
                });
            }

            function renderWrongLesson(data, subjectId, courseId){
                var currentLessons = "";
                _.each(data, function(lessonItem) {
                    if(lessonItem.courseid == courseId) {
                        currentLessons += '<li><a href="javascript:void(0);" type="1-' + subjectId + '-' + courseId + '-' + lessonItem.lessonid + '" name="' + lessonItem.lessonname + '">' + lessonItem.lessonname + '<span class="wb-nav-num">(<em>' + lessonItem.isreview + '</em>/<span>' + lessonItem.num + '</span>)</span></a></li>';
                    }
                });
                that.$el.find(".wb-nav-lesson").html("").append(currentLessons);
                $(".wb-nav-lesson li a").on("click", "" , that, that.getLessonPath);
            }
        },

        initWrongs : function() {
            var that = this;
            this.type = 5;
            this.idByType = -1;
            this.wbType = 2;
            this.wrongBookPaging.del_cache_data();
            this.getWrongData(this.type, this.isNeeded, this.idByType, this.wbType);
            $("#J_wbCrumbs").html("全部课程");
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

            this.wrongBookPaging.set_request_param(requireDataString);
            this.wrongBookPaging.showPage(0, isNeeded);
        },

        getSortData : function(e){
            var that = this;
            $(".j_dropdownSort").html($(e.currentTarget).text() + '<em class="ui-icon-triangle-dropdown"></em>');
            this.type = "5";
            this.idByType = "-1";
            this.wbType = parseInt($(e.currentTarget).attr("type"));
            this.lessonDatas = [];
            this.getCourseData(this.wbType);
            this.wrongBookPaging.del_cache_data();
            this.getWrongData(this.type, this.isNeeded, this.idByType, this.wbType);

            $("#J_wbCrumbs").html("全部课程");
        },

        displayAction : function(e){
            $(e.currentTarget).addClass("ui-topic-hover");
        },

        hideAction : function(e){
            $(e.currentTarget).removeClass("ui-topic-hover");
        },

        deleteItem : function(e) {
            var secid = $(e.currentTarget).attr("secid");
            var samecid = $(e.currentTarget).attr("samesection");
            var that = this;
            var data = $.param({ "delete" : 1,"sectionguid" : secid,"samesectionguid" : samecid});
            $.ajax({
                url: "/api/wrongbook/deleterecord/",
                type : 'PUT',
                data : data,
                success: function(){
                    e.data.wrongBookPaging.del_cache_data();
                    e.data.getWrongData(e.data.type, e.data.isNeeded, e.data.idByType, e.data.wbType);
                    e.data.getCourseData(e.data.wbType);
                }
            });
        },

        getPathData : function(element, tag){
            var newArray = element.attr("type").split("-");
            this.type = newArray[0].toString();
            if(tag == 1) {
                this.idByType = newArray[1].toString(); //subjectId
            }
            if(tag == 2) {
                this.idByType = newArray[2].toString(); //courseId
            }
            if(tag == 3) {
                this.idByType = newArray[3].toString(); //lessonId
            }
            this.wrongBookPaging.del_cache_data();
            this.getWrongData(this.type, this.isNeeded, this.idByType, this.wbType);
            if(this.needViewCount == 0 || this.totalCount == 0){
                $("#J_needReviewCount").html("(" + this.needViewCount + ")");
                $("#J_allCount").html("(" + this.totalCount + ")");
            }
        },

        getSubjectPath : function(e){
            var that = e.data;
            var $self = $(e.currentTarget);
            var subjectType = $self.attr("type");
            var subjectId = (subjectType.split("-"))[1];

            that.renderPathData(subjectId, null, null);
            that.getPathData($self, 1);
        },

        getCoursePath : function(e){
            var that = e.data;
            var $self = $(e.currentTarget);
            var courseType = $self.attr("type");
            var subjectId = (courseType.split("-"))[1];
            var courseId = (courseType.split("-"))[2];

            that.renderPathData(subjectId, courseId, null);
            that.getPathData($self, 2);
        },

        getLessonPath : function(e){
            var that = e.data;
            var $self = $(e.currentTarget);
            var lessonType = $self.attr("type");
            var subjectId = (lessonType.split("-"))[1];
            var courseId = (lessonType.split("-"))[2];
            var lessonId = (lessonType.split("-"))[3];

            that.renderPathData(subjectId, courseId, lessonId);
            that.getPathData($self, 3);
        },

        renderPathData : function(sid, cid, lid) {
            var that = this;
            var subjectType = "";
            var courseType = "";
            var lessonType = "";
            var subjectName = "";
            var courseName = "";
            var lessonName = "";
            var isNeededNum = 0;
            var allNum = 0;

            for (var i = 0, len = that.subjectDatas.length; i < len; i++) {
                if(that.subjectDatas[i].subjecttype == sid) {
                    subjectName = that.subjectDatas[i].subjectname;
                    subjectType =  "2-" + sid;
                    if(cid == null) {
                        isNeededNum = that.subjectDatas[i].isreview;
                        allNum = that.subjectDatas[i].num;
                    }
                    else {
                        for (var j = 0, lenc = that.subjectDatas[i].courses.length; j < lenc; j++) {
                            if(that.subjectDatas[i].courses[j].courseid == cid) {
                                courseName = that.subjectDatas[i].courses[j].coursename;
                                courseType = "4-" + sid + "-" + cid;
                                isNeededNum = that.subjectDatas[i].courses[j].isreview;
                                allNum = that.subjectDatas[i].courses[j].num;
                            }
                        }
                    }
                }
            }

            if(lid != null) {
                for (var i = 0, lens = that.lessonDatas.length; i < lens; i++) {
                    if(that.lessonDatas[i].subjectid == sid) {
                        for (var j = 0, lenl = that.lessonDatas[i].lessondata.length; j < lenl; j++) {
                            if(that.lessonDatas[i].lessondata[j].lessonid == lid) {
                                lessonName = that.lessonDatas[i].lessondata[j].lessonname;
                                lessonType = "1-" + sid + "-" + cid + "-" + lid;
                                isNeededNum = that.lessonDatas[i].lessondata[j].isreview;
                                allNum = that.lessonDatas[i].lessondata[j].num;
                            }
                        }
                    }
                }
            }
            if(cid == null) {
                $("#J_wbCrumbs").html("<a href='javascript:void(0);' type='" + subjectType +"' class='wb-crumbs-s'>" + subjectName + "</a>");
            }
            else {
                if(lid == null) {
                    $("#J_wbCrumbs").html("<a href='javascript:void(0);' type='" + subjectType +"' class='wb-crumbs-s'>" + subjectName + "</a><span>&gt;</span><a href='javascript:void(0);' type='" + courseType  +"' class='wb-crumbs-c'>" + courseName + "</a>");
                }
                else {
                    $("#J_wbCrumbs").html("<a href='javascript:void(0);' type='" + subjectType +"' class='wb-crumbs-s'>" + subjectName + "</a><span>&gt;</span><a href='javascript:void(0);' type='" + courseType +"' class='wb-crumbs-c'>" + courseName + "</a><span>&gt;</span><a href='javascript:void(0);' type='" + lessonType +"' class='wb-crumbs-l'>" + lessonName + "</a>");
                }
            }

            that.needViewCount = isNeededNum;
            that.totalCount = allNum;
        },

        getCrumbs : function(e){
            var that = this;
            var $self = $(e.currentTarget);
            var len = ($self.attr("type").split("-")).length;
            var $crumbsItem = $("#J_wbCrumbs").children();
            var isNeededNum = 0;
            var allNum = 0;

            if(len == 2) {
                var subjectId = ($self.attr("type").split("-"))[1];
                for (var i = 0, len = that.subjectDatas.length; i < len; i++) {
                    if(that.subjectDatas[i].subjecttype == subjectId) {
                        isNeededNum = that.subjectDatas[i].isreview;
                        allNum = that.subjectDatas[i].num;
                    }
                }
                if($crumbsItem.hasClass("wb-crumbs-l")){
                    $crumbsItem.remove(".wb-crumbs-l");
                }
                if($crumbsItem.hasClass("wb-crumbs-c")){
                    $crumbsItem.remove(".wb-crumbs-c");
                }
                $crumbsItem.remove("span");

                that.needViewCount = isNeededNum;
                that.totalCount = allNum;
                that.getPathData($self, 1);
            }
            if(len == 3) {
                var subjectId = ($self.attr("type").split("-"))[1];
                var courseId = ($self.attr("type").split("-"))[2];
                for (var i = 0, len = that.subjectDatas.length; i < len; i++) {
                    if(that.subjectDatas[i].subjecttype == subjectId) {
                        for (var j = 0, lenc = that.subjectDatas[i].courses.length; j < lenc; j++) {
                            if(that.subjectDatas[i].courses[j].courseid == courseId) {
                                isNeededNum = that.subjectDatas[i].courses[j].isreview;
                                allNum = that.subjectDatas[i].courses[j].num;
                            }
                        }
                    }
                }
                var hasSpan = $self.next().is("span");
                if($crumbsItem.hasClass("wb-crumbs-l")) {
                    $crumbsItem.remove(".wb-crumbs-l");
                }
                if(hasSpan) {
                    $self.next().remove("span");
                }

                that.needViewCount = isNeededNum;
                that.totalCount = allNum;
                this.getPathData($self, 2);
            }
            if(len == 4) {
                this.getPathData($self,3);
            }
        },

        showPrompt : function(){
            if($.cookie("wb_tip") == 1){
                $("#prompt").hide();
            }
            else{
                $.cookie("wb_tip", null,{path:'/'});
                $("#prompt").show();
            };
            $("#J_promptKnow").click(function(){
                $("#prompt").hide();
                $.cookie("wb_tip", 1,{expire:30,path:'/'});
            });
            $("#J_promptClose").click(function(){
                $("#prompt").hide();
            });
        },

        remove  : function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }
    });

    return wrongsView;
});