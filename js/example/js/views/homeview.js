/**
 * Date: 13-6-20
 * Time: 下午4:48
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var viewTemplates = require("../../html/home.html");
    var paging = require("../components/paging");
    var popWindow = require("../components/popup");
    var slide_menus = require("../components/slide_menus");
    var toggle_tab = require("../components/toggle_tab");
    var homeBaseInfoModel = require("../models/homemodel");
    var urlConfig = require("../components/web_url_config");
    var Listen = require("../components/listen");
    var listenObj = new Listen();

    var homeView = Backbone.View.extend({
        el : "#content",
        events : {
            "mouseenter .home-user-photo" : "displaySetPhotoLink",
            "mouseleave .home-user-photo" : "hideSetPhotoLink",
            "click .j_playLesson" : 'playLesson'

        },
        playLesson : function(e) {
            var courseid = $(e.currentTarget).attr("course_guid");
            var realGuid = $(e.currentTarget).attr('course_real_guid');
            var lessonid = $(e.currentTarget).attr('lesson');
            listenObj.listenLesson(user_data.userName, courseid, realGuid, lessonid, 1, 0);
        },

        initialize : function() {
            this.render();
        },

        render : function() {
            var that = this;

            var thisModel = new homeBaseInfoModel();
            thisModel.fetch({wait: true ,success : function(model, res) {
                var faceSrc;
                if (res.face == null) {
                    faceSrc = res.userFigure == 1 ? imageUrl + "images/qa/tec_photo.png" : imageUrl + "images/qa/stu_photo.png";
                }else{
                    faceSrc = res.face;
                }

                var template = _.template(viewTemplates,{userName:user_data.userName,easyCash:res.easyCash,nickName:res.nickName,faceSrc:faceSrc});

                that.$el.html(template);
                if(res.data.length){
                    for(var i= 0; i< res.data.length ;i++){
                        $(".home-user-medal").append('<li><img width="66" height="66" alt="'+ res.data[i].count
                            + '个龙级勋章" title="'+res.data[i].count+ '个'+
                            res.data[i].name+'级勋章" src="../studycenter/images/'+res.data[i].image + '"><span>x'+ res.data[i].count
                        +'</span></li>');
                    }
                }else{
                    $(".home-user-medal").append('<li>暂没获得荣誉，赶快完成任务来获取荣誉，<a href="http://bbs.jiandan100.cn/read.php?tid=653532">点击此处</a></li>');
                }

                //个人中心 公告栏
                var getBulletinsData = function() {
                    var homeBulletinsModel = require("../models/homebulletinsmodel");
                    var thisModel = new homeBulletinsModel();
                    var allNotice = "";
                    thisModel.fetch({wait: true,
                        success :function(model, res) {
                            for(var i= 0; i< res.data.length; i++){
                                allNotice += '<li><span class="frose">' + res.data[i].header + '</span>' + res.data[i].title + '<a href="' + res.data[i].url + '" target="_blank" class="ui-button ui-button-swhite"><span>详情点击</span></a></li>';
                            }
                            if(res.data.length > 3) {
                                allNotice += '<li class="home-notice-fold"><span class="j_foldNoticesTaggle sp-icon">展开查看全部</span></li>';
                            }
                            $(".j_dropdownNotesCon").html(allNotice);
                            that.foldNotices();
                        }
                    });
                }();

                var changeShowtTime = function (timestamp){
                    timestamp = timestamp + 28800;
                    var timeEquation = Date.parse(new Date())/1000 - timestamp;
                    if(timeEquation <  36000){
                        if(timeEquation > 0 && timeEquation < 3600){
                            return parseInt(timeEquation / 60 + 1).toString() +'分钟前';
                        }else if(timeEquation < 0){
                            return '1分钟前';
                        }else{
                            return parseInt(timeEquation / 3600).toString() +'小时前';
                        }
                    }else{
                        var date = new Date(parseInt(timestamp) * 1000);
                        return date.toLocaleDateString().replace(/年|月/g, "-").replace(/日/g, " ") + ' '
                            + date.getHours() + ':' + date.getMinutes();
                    }
                };

                var studyInfoByType = function(data){
                    var showtext = '';
                    switch (data.type){
                        case 1:
                            showtext = '<tr><td width="75%" class="textleft">听了' + parseInt(data.totaltime/60+1)
                                + '分钟“' + data.coursename + '”中的<a class="j_playLesson" course_guid='+ data.courseguid +' course_real_guid='+ data.realguid +' lesson='+ data.lessonguid +'>“' + data.lessonname + '”</a></td><td width="18%">'
                                + changeShowtTime(data.time).toString() +'</td></tr>';
                            break;
                        case 2:
                            showtext = '<tr><td width="75%" class="textleft">在答疑中心提了问题：<a href="' + web_url_config.dayi + '/question/'+ data.questionid + '/" target="_blank">'
                                + data.title + '</a></td><td>' + changeShowtTime(data.time).toString()
                                + '</td></tr>';
                            break;
                        case 3:
                            showtext = '<tr><td width="75%" class="textleft">在答疑中心回答了问题：<a href="' + web_url_config.dayi + '/question/'+ data.questionid + '/" target="_blank">'
                                + data.title + '</a></td><td>' + changeShowtTime(data.time).toString()
                                + '</td></tr>';
                            break;
                    }

                    $(".home-trends-history").append(showtext);
                };

                showHomeMyStudyInfo = function(start){
                    var homeMyStudyInfoModel = require("../models/homemystudyinfomodel");
                    var thisModel = new homeMyStudyInfoModel();
                    thisModel.fetch({
                        wait: true ,
                        data:$.param({'start':start}),
                        success :function(model, res) {
                                for(var i= 0; i< res.data.length ;i++){
                                    studyInfoByType(res.data[i]);
                                }
                            if (i == 0 && start == 0){
                                $(".home-trends-no").show();
                            }
                            if (res.data.length < 10){
                                $(".home-trends-more").hide();
                            }
                        }
                    });
                    if(start >= 10){
                        $(".home-trends-more").hide();
                    }
                };
                showHomeMyStudyInfo(0);

                window.showOnlineLive = function (start,length) {
                    if ($(".home-trends-online").text() == '') {
                        var homeOnlineLiveModel = require("../models/homeonlinelivemodel");
                        var thisModel = new homeOnlineLiveModel();
                        thisModel.fetch({
                            wait: true,
                            success: function (model, res) {
                                for (var i = 0; i < res.data.length; i++) {
                                    var showtext = '<li><a href="' + res.data[i].href + '" target="_blank">' + res.data[i].alt + '</a></li>';
                                    $(".home-trends-online").append(showtext);
                                }
                            }
                        });
                    }
                };

                var storyListenPagingCallBack = function (obj){
                    var i = 0;
                    var showtext;
                    var storyListenData = obj._current_data;
                    $("#J_listenHistory > tbody").html("");
                    for(i = 0;i < storyListenData.length;i ++){
                        showtext = '<tr><td>'
                            + storyListenData[i].curDate
                            + '</td><td>'
                            + storyListenData[i].courseName
                            + '</td><td>'
                            + storyListenData[i].lessonName
                            + '</td><td>'
                            + storyListenData[i].startTime
                            + '</td><td>'
                            + storyListenData[i].endTime
                            + '</td><td>'
                            + (parseInt(storyListenData[i].listenLength / 60) + 1)
                            + '分钟</td></tr>';
                        $("#J_listenHistory > tbody").append(showtext);
                    }
                    slide_menus.init({targetElement:".j_dropdownNotes", parentElement:".home-notice", childElement:".j_dropdownNotesCon", currentName:".dropdownHover", eventType:"click"});
                };

                var isInit = 0;

                var storyPagingCallBack = function(obj){
                    isInit = 1;
                    var i = 0;
                    var showtext;
                    var storyData = obj._current_data;
                    $(".home-trends-story > thead > tr > th").first().html(obj._cur_original_data.district + "地区" + obj._cur_original_data.grade + "年级进步故事");
                    $(".home-trends-story > tbody").html("");
                    for(i = 0;i < storyData.length;i ++){
                        showtext = '<tr><td class="textleft"><a href="javascript:void(0);" class="j_story">'
                            + storyData[i].title
                            + '</a></td><td>'
                            + storyData[i].inserttime
                            + '</td></tr>';
                        $(".home-trends-story > tbody").append(showtext);
                    }

                    var storyPop = new popWindow({
                        trigger: ".j_story",
                        popupBlk: "#J_storyPop",
                        closeBtn: "#J_storyPopClose",
                        eventType : "click",
                        useOverlay : true,
                        isCentered : true,
                        isDrag : true,
                        onAfterPop : function(obj,event){
                            var clickTargetData = storyData[$(event.target).parents('tr').index()];
                            $("#J_storyPop > div> h2").html(clickTargetData.title);
                            $(".story-pop-con > dl> dd").first().html(clickTargetData.progress_text);
                            $(".story-pop-con > dl> dd").next().html(clickTargetData.selftips);
                            $(".story-pop-con > dl> dd").next().html(clickTargetData.returnvisits);
                            $(".story-pop-con > dl> dd").next().html(clickTargetData.ourpoints);
                            $(".story-pop-photo > span").html(clickTargetData.uname);
                            var showStoryHistory = function(){
                                var StoryListenPaging = require("../components/paging");
                                var storyListenPaging = new StoryListenPaging(
                                    "/api/home/storylistenhistory/",
                                    "id="+ clickTargetData.id +"&index=",
                                    5,
                                    ".j_listenHistoryPage",
                                    "#J_noListenHistory",
                                    "#J_listenHistory >tbody",
                                    storyListenPagingCallBack
                                );
                                storyListenPaging.showPage(0);
                            }
                            toggle_tab.init({tabName:".j_storyPopTab .ui-tab-item", noContent:false,
                                currentName:".ui-tab-item-current", contentName:".j_storyPopCon",
                                eventType:"click",callback:showStoryHistory});
                        }
                    });
                };

                window.showStudyStory = function () {
                    if(isInit == 0){
                            var StoryPaging = require("../components/paging");
                            var storyPaging = new StoryPaging(
                                "/api/home/studystory/",
                                "index=",
                                10,
                                ".j_storyPage",
                                ".j_noStoryPage",
                                ".home-trends-story > tbody",
                                storyPagingCallBack
                            );
                        storyPaging.showPage(0);
                    }
                };

                slide_menus.init({targetElement:".j_dropdownNotes", parentElement:".home-notice", childElement:".j_dropdownNotesCon", currentName:".dropdownHover", eventType:"click", callback:that.displayPartNotices});
                toggle_tab.init({tabName:".j_trendsTab .ui-tab-item", noContent:false, currentName:".ui-tab-item-current", contentName:".j_trendsTabCon>div", eventType:"click"});
            }});
        },

        foldNotices : function() {
            if($(".j_foldNoticesTaggle") != "") {
                var $displayItems = $(".j_dropdownNotesCon li:gt(2):not(:last)");
                $displayItems.hide();
                $(".j_foldNoticesTaggle").click(function() {
                    var $self = $(this);
                    if($displayItems.is(":visible")){
                        $displayItems.hide();
                        $self.text("展开查看全部").removeClass("open");
                    }else{
                        $displayItems.show();
                        $self.text("收起显示部分").addClass("open");
                    }
                });
            }
        },

        displayPartNotices : function() {
            if($(".j_foldNoticesTaggle") != "") {
                var $displayItems = $(".j_dropdownNotesCon li:gt(2):not(:last)");
                $displayItems.hide();
                $(".j_foldNoticesTaggle").text("展开查看全部").removeClass("open");
            }
        },

        displaySetPhotoLink : function(e) {
            $(e.currentTarget).children(".j_displaySetPhoto").show();
        },

        hideSetPhotoLink : function(e) {
            $(e.currentTarget).children(".j_displaySetPhoto").hide();
        }
    });

    return homeView;
});
