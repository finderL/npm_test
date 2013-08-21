/**
 * 练习成绩
 * User: shy
 * Date: 13-4-7
 * Time: 下午12:07
 * 练习成绩页面
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Popup = require("../components/popup.js");
    var Card = require("../components/card.js");
    var CutTips = require("../components/display_ellipsis.js");
    var templates = require("../../html/exercisemark.html");
    var Page = require("../components/paging");
    var myexercise = new Backbone.Model();
    var myexercises = new Backbone.Collection({model : myexercise});
    myexercises.url = baseUrl + "/api/my/exerciselist/all/";
    var exerciseView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            var that = this;
            this.pview = null;
            this.listenTo(myexercises, 'reset', this.render);
//            this.listenTo(myexercises, 'reset', this.renderAll);
            //this.render();
            myexercises.fetch({reset:true});
        },
        template : _.template(templates),
        events : {
            "click .mark-subjuect li a" : "tabSubject",
            "click .mark-lesson a" : "showLessonList",
            "click .lesson-list .lesson-list-item-title" : "toggleExerices"
        },

        render : function() {
            this.$el.html(this.template({data : myexercises.toJSON()}));
            this.displaySubject(0);
        },

        tabSubject : function (e) {
            var eindex = $(e.currentTarget).attr("eindex");
            this.displaySubject(eindex);
        },

        displaySubject : function (index) {
            $(".mark-subjuect li").removeClass("ui-tab-item-current");
            $(".mark-subjuect li").eq(index).addClass("ui-tab-item-current");

            var currentModel = myexercises.at(index); //取得当前点击的 学科的数据模型
            this.displayCourses(currentModel.get("list"));

        },

        displayCourses : function (courses) {
            var $disDom = $(".mark-lesson");
            $disDom.html("");
            _.each(courses, function (course,index) {
                var className = index == 0 ? "mark-lesson-current" : "";
                $disDom.append("<a authtype='" +course.authtype+ "' guid='"+course.guid+"' realguid='"+course.realguid+"' href='javascript:;' class='" + className + "'>" + course.coursename +"</a> ");
            });
            this.getLessonList(courses[0].authtype, courses[0].guid, courses[0].realguid);
        },

        getLessonList : function (atype, scid, rid) {
            var that = this;
            var lessonModel = new Backbone.Model();
            var lessonCollection = new Backbone.Collection({model : lessonModel});
            lessonCollection.url = baseUrl + "/api/my/exerciselist/lessons/";
            lessonCollection.fetch({data:{"atype":atype, scid:scid, rid : rid},
                success : function(collection, response, options) {
                    if (response.success) {
                        that.dispalyLessonData(response.lessondata);
                    } else {

                        alert(response.failDesc);
                        return false;
                    }
            }});
        },

        dispalyLessonData : function (lessons) {
            $(".lesson-list").html("");
            _.each(lessons, function(lesson, index) {
                $(".lesson-list").append("<li class='lesson-list-item'><div lid='"+lesson.guid+"' index='"+index+"' class='lesson-list-item-title'><h4>" +lesson.lessonName+"</h4><i class='ui-icon ui-icon-arrows-right'></i></div><p class='j_lessonLoading fn-hide mt10'><img src='images/loading.gif'></p><ul class='mark-lesson-list fn-clear fn-hide'></ul></li>");
            });

            this.getExericesByLesson(lessons[0].guid, 0);
        },

        getExericesByLesson : function (lid, index) {
            $(".lesson-list > li").eq(index).find(".j_lessonLoading").show().siblings(".mark-lesson-list").show();
            var that = this;
            var exerciseModel = new Backbone.Model();
            var exerciseCollection = new Backbone.Collection({model : exerciseModel});
            exerciseCollection.url = baseUrl + "/api/my/exerciselist/exerices/";
            exerciseCollection.fetch({data : {lid : lid}, success : function(collection, response) {
                if (response.success) {
                    that.displayExercies(response.data, index);
                } else {
                    $(".lesson-list > li").eq(index).find(".j_lessonLoading").hide();
                    $(".lesson-list > li").eq(index).find(".mark-lesson-list").html('<li>该课程暂无练习。</li>').show();
                    return false;
                }
            }});
        },

        displayExercies : function (exercises, index) {
            $(".lesson-list > li").eq(index).find("i").removeClass("ui-icon-arrows-right").addClass("ui-icon-arrows-down");
            $(".lesson-list > li").eq(index).find(".j_lessonLoading").hide();
            var $disDom = $(".lesson-list > li").eq(index).find(".mark-lesson-list");
            var that = this;
            $disDom.html("");
            _.each(exercises, function (exer, index) {
                $disDom.append("<li><span class='mark-sign mark-sign" + exer.exercise_result + "'></span><a index='" + index + "' href='javascript:void(0);' class='mark-lesson-title'>" + exer.name +"</a></li>")
            });
            CutTips.init({"targetObj":".mark-lesson-list li a","numLimited":16});
            var card = Card.init({"trigger":".mark-lesson-list li a","popblk":".j_markPop", "renderFun" : function(e, $card) {
                that.renderTip(e, $card, exercises);
            }});
        },

        renderTip : function (e, $card, data) {
            var that = this;
            var lidDom = $(e.currentTarget).parents("ul").first().siblings("div");
            var index = $(e.currentTarget).attr("index");
            var sectionInfo = data[index];
            var sameSection = sectionInfo.same_section;
            $card.find("tbody").html("");
            var sameSections = [];
            _.each(sameSection, function(sec, index) {
                var temp = sec.split(":");
                var tempSection = temp[0];
                var tempScore = temp[1] >= 1 ?  temp[1] : 0 ;
                sameSections.push(tempSection);
                var tempClass = tempScore == 0 ? "mark-icon-undo" : tempScore > 2 ? "mark-icon-right" : "mark-icon-wrong";
                var scoreText = tempScore == 0 ? "待练习" : tempScore == 1 ? "全错误" : tempScore == 2 ? "部分对" : "全对了";
                var str = "<tr> <td width='25%' class='textleft'><span class='sp-icon " + tempClass + "'>" + scoreText + "</span></td>";
                str += '<td width="30%">第' + (++index) + '题</td>';
                str += '<td width="45%"><a class="ui-button ui-button-sblue j_goPractice" sectionid="' + sectionInfo.id + '" samesecionid="' + tempSection + '" href="javascript:void(0);"><span>立即做题</span></a></td></tr>';
                $card.find("tbody").append(str);
            });
            var t2 = new Popup({
                trigger:".j_goPractice",
                popupBlk:"#J_exercisePop",
                closeBtn:".j_exercisePopClose a",
                eventType:"click",
                useOverlay:true,
                isCentered:true,
                isDrag:true,
                onAfterPop : function(c, e){
                    that.goPractice(e, this, lidDom);
                    //var sectionguid = $target.parents("li").attr("id");
                    //var secid = $target.parents("li").attr("sectionguid");
                    //that.showPractice(sectionguid, secid, this);
                    //that.closePrompt();
                },
                onCloseCallBack : function() {
                    if (that.pview) {
                        that.pview.stop();
                    }
                }
            })
        },

        goPractice : function (e, popWindow, lidDom) {
            var sameid = $(e.currentTarget).attr("samesecionid");
            var sectionid = $(e.currentTarget).attr("sectionid");
            var that = this;
            require.async("./practiceview", function(practiceView) {
                that.pview = new practiceView();
                that.pview.renderDom(".j_exercisePopDel",sameid, sectionid);
                that.pview.setThisToClose(popWindow);
                that.pview.practiceOverBack = function () {
                    var lid = lidDom.attr("lid");
                    var index = lidDom.attr("index");
                    that.getExericesByLesson(lid, index);
                }
            });
        },

        showLessonList : function (e) {
            $(e.currentTarget).addClass("mark-lesson-current").siblings().removeClass("mark-lesson-current");
            var atype = $(e.currentTarget).attr("authtype");
            var scid = $(e.currentTarget).attr('guid');
            var rid = $(e.currentTarget).attr('realguid');
            $(".lesson-list").html("").append("<li class='lesson-list-item'><p class='j_noLesson'>该课程暂无练习。</p></li>");
            this.getLessonList(atype, scid, rid);
        },

        toggleExerices : function (e) {
            var $disDom = $(e.currentTarget).siblings(".mark-lesson-list");
            if ($disDom.is(":visible")) {
                $(e.currentTarget).find("i").removeClass("ui-icon-arrows-down").addClass("ui-icon-arrows-right");
                $disDom.hide();
            }
            else {
                $(e.currentTarget).find("i").removeClass("ui-icon-arrows-right").addClass("ui-icon-arrows-down");
                if($disDom.html() == "") {
                    var lid = $(e.currentTarget).attr("lid");
                    var index = $(e.currentTarget).attr("index");
                    this.getExericesByLesson(lid, index);
                }
                $disDom.show();
            }
        },

        remove  : function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }
    });

    return exerciseView;
});