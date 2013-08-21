/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-3-25
 * Time: 下午5:23
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var slide_menus = require("../components/slide_menus");

    var courseType = user_data.ischarge ? "formal/" : "free/";
    var exerciseType = user_data.ischarge ? "noExercies" : "allExercies";

    var studyRouter = Backbone.Router.extend({
        routes: {
            "home" : "showHome",
            "courses" : "showCourseList",
            "courses/*path" : "showCourseList",
            "course/:coursetype/:id" : "showCourseInfo",
            "exercises" : "showExerciseList",
            "wrongs" : "showWrongList",
            "wrongs/*path" : "showWrongList",
            "wrong/*path" : "showWrongInfo",
            "wrongsrecycle" : "showWrongRecycle",
            "studywarm" : 'showStudyWarm',
            "homework/*path" : 'showHomeWork',
            "exercisemark" : 'showExerciseMark',
            "active" : 'showActive',
            "activestep2" : 'showActiveStep2',
            "activemodule" : 'showActiveModule',
            "personalitylesson" : 'showPersonalityLesson',
            "activehistory" : 'showActiveHistory',
            "userinfo" : 'showUserInfo',
            "changepwd" : 'showChangePwd',
            "setphoto" : 'showSetPhoto',
            "myorder" : 'showMyorder',
            "onlinepayment" : 'showOnlinePayment',
            "paymenthistory" : 'showPaymentHistory',
            "*actions" : "defalutAction"
        },

        defalutAction : function() {
            this.showCourseList()
        },

        showHome : function() {
            this.displayMenu(-1);
            require.async("./home", function(homeInfo) {
                homeInfo.init();
            });
        },

        showCourseList : function(path) {
            this.displayMenu(0);
            require.async("./courses", function(courses) {
                //如果当前的地址是课程列表
                if(!path) {
                    courses.init(courseType);
                } else {
                    courses.init(path);
                }

            });
        },

        showCourseInfo : function(courseType, cid) {
            this.displayMenu(0);
            require.async("./courseinfo", function(courseinfo) {
                courseinfo.init(courseType, cid);
            });
        },

        showExerciseList : function() {
            this.displayMenu(1);
            this.displaySubMenu(0);
            document.title="学习中心-我的练习_简单学习网";
            require.async('./exercises', function (exercises) {
                exercises.init(exerciseType);
            });
        },

        showWrongList : function() {
            this.displayMenu(5);
            this.displaySubMenu(2);
            require.async("./wrongs", function(wrongs) {
                wrongs.init();
            });
        },

        showWrongInfo : function() {
            this.displayMenu(5);
            this.displaySubMenu(2);
            require.async("./wronginfo", function(wrongInfo) {
                wrongInfo.init();
            });
        },

        showWrongRecycle : function() {
            this.displayMenu(5);
            this.displaySubMenu(3);
            require.async("./wrongrecycle", function(wrongRecycle) {
                wrongRecycle.init();
            });
        },

        displayMenu : function(index) {
            if(tempPop) {
                tempPop.close();
            }
            $(".ui-subnav-item").attr({"style":""});
            $("#J_navDropdown li").removeClass("ui-nav-item-current");
            if (index == -1) {
                return ;
            }
            $("#J_navDropdown li").eq(index).addClass("ui-nav-item-current");
        },

        displaySubMenu : function(index){
            $(".ui-subnav-item").attr({"style":""});
            $(".ui-subnav-item").eq(index).attr({"style":"background-color:#fff; font-weight:bold;"});
        },

        showStudyWarm : function(){
            document.title="学习中心-预约提醒_简单学习网";
            this.displayMenu(8);
            this.displaySubMenu(4);
            require.async('./studywarm', function (studywarm) {
                studywarm.init();
            });
        },

        showHomeWork : function(){
            document.title="学习中心-学习档案_简单学习网";
            this.displayMenu(8);
            this.displaySubMenu(5);
            require.async('./homework', function (studyrecord) {
                studyrecord.init();
            });
        },

        showExerciseMark : function(){
            document.title="学习中心-练习成绩_简单学习网";
            this.displayMenu(1);
            this.displaySubMenu(1);
            require.async('./exercisemark', function (studyrecord) {
                studyrecord.init();
            });
        },

        showActive : function(){
            document.title="学习中心-课程激活_简单学习网";
            this.displayMenu(11);
            this.displaySubMenu(6);
            require.async('./active', function (active) {
                active.init();
            });
        },

        showActiveStep2 : function(){
            document.title="学习中心-课程激活_简单学习网";
            this.displayMenu(11);
            this.displaySubMenu(6);
            var templates = require("../../html/activestep2.html");
            $("#content").html(templates);
        },

        showActiveModule : function(){
            document.title="学习中心-课程模块激活_简单学习网";
            this.displayMenu(11);
            this.displaySubMenu(8);
            require.async('./activemodule', function (activemodule) {
                activemodule.init();
            });
        },

        showPersonalityLesson : function(){
            document.title="学习中心-弱课课程激活_简单学习网";
            this.displayMenu(11);
            this.displaySubMenu(7);
            require.async('./personalitylesson', function (personal) {
                personal.init();
            });
        },

        showActiveHistory : function(){
            document.title="学习中心-激活历史_简单学习网";
            this.displayMenu(11);
            this.displaySubMenu(9);
            require.async('./activehistory', function (history) {
                history.init();
            });
        },

        showUserInfo : function() {
            this.displayMenu(0);
            this.displaySubMenu(0);
            require.async("../views/userinfoview", function(userInfoView) {
                return new userInfoView();
            });
        },

        showChangePwd : function() {
            this.displayMenu(0);
            this.displaySubMenu(1);
            require.async("../views/userpasswordview", function(userPassWordView) {
                return new userPassWordView();
            });
        },

        showSetPhoto : function() {
            this.displayMenu(0);
            this.displaySubMenu(2);
            require.async("../views/userphotoview", function(userPhotoView) {
                return new userPhotoView();
            });
        },

        showMyorder : function() {
            this.displayMenu(4);
            this.displaySubMenu(3);
            require.async("../views/myorderview", function(myorderView) {
                return new myorderView();
            });
        },

        showOnlinePayment : function() {
            this.displayMenu(4);
            this.displaySubMenu(4);
            require.async("../views/onlinepaymentview", function(onlinePaymentView) {
                return new onlinePaymentView();
            });
        },

        showPaymentHistory : function() {
            this.displayMenu(4);
            this.displaySubMenu(5);
            require.async("../views/paymenthistoryview", function(paymentHistoryView) {
                return new paymentHistoryView();
            });
        }

    });

    var study = new studyRouter();
    slide_menus.init({targetElement:".j_dropdownUser", parentElement:".top-personal .item", childElement:".j_slideUser", currentName:".dropdownHover", eventType:"mouseenter"});
    $('body').on("click", '.j_logoff', this, function () {
        var ajaxParam = {
            type: "POST",
            url: baseUrl + "/service/user/",
            data: "do=signoff",
            dataType: "json",
            success : function () {
                window.location.reload();
            }
        };
        $.ajax(ajaxParam);
    });
	$("body").on("mouseenter", ".ui-table tr", function(){
        var $self = $(this);
        $self.addClass("ui-table-hover");
    });
    $("body").on("mouseleave", ".ui-table tr", function(){
        var $self = $(this);
        $self.removeClass("ui-table-hover");
    });
    Backbone.history.start();
    return study;
})
