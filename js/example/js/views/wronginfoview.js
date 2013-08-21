/**
 * Date: 13-4-25
 * Time: 下午4:08
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var cookie = require("cookie");
    var viewTemplates = require("../../html/viewwrongbook.html");
    var wrongInfoModel = require("../models/wronginfomodel");
    var paging = require("../components/paging");
    var popWindow = require("../components/popup");
    var slide_menus = require("../components/slide_menus");
    var toggle_tab = require("../components/toggle_tab");
    var wordsLimited = require("../components/input_words_limited");
    var JSON = require("json");

    var wrongInfoView = Backbone.View.extend({
        el : "#content",

        template : _.template(viewTemplates),

        events : {

        },

        initialize : function() {
            var that = this;
            this.userName = user_data.userName;
            this.type = "";
            this.isNeeded = "";
            this.idByType = "";
            this.wbType = "";
            this.isMyself = 0; //0=全部心得/总结，1=我的心得/总结
            this.currentCommentType = 0;
            this.wrongInfoData = {};
            this.commentPaging = {};
            this.commentPagingSummary = {};
            this.updateViewTimeCacheData = new Array();

            this.toChangeComment = function(){
                var $self = arguments[0];
                that.currentCommentType = parseInt($self.find("a").attr("type"));
                that.changeComment(that.currentCommentType);
            };
            this.renderWrongInfo();
        },

        render : function() {
            var that = this;
            $("#J_wrongBookAnswer").on("click", "", this, this.showWrongBookAnswer);
            $("#J_wrongBookListen").on("click", "", this, this.wrongBookListen);
            $(".j_commentSort li a").on("click", "", this, this.getSortChangeData);
            $("#J_submitComment").on("click", "", this, this.submitComment);
            $(".j_sameSectionTabAnswer").on("click", "", this, this.changeSameSection);
            this.commentPaging = new paging(
                "/api/wrongbook/commentlist/",
                "",
                10,
                ".j_commentPage",
                "#J_noWbComment",
                "#J_wbComment",
                displayCommentCallBack
            );
            this.commentPagingSummary = new paging(
                "/api/wrongbook/commentlist/",
                "",
                10,
                ".j_commentSummaryPage",
                "#J_noWbCommentSummary",
                "#J_wbCommentSummary",
                displayCommentCallBack
            );

            this.renderComment();
            this.getPreAndNextURL();
            this.getPath();

            slide_menus.init({targetElement:".j_dropdownCommentSort", parentElement:".wb-sort-select", childElement:".j_commentSort", currentName:".dropdownHover", eventType:"mouseenter"});

            toggle_tab.init({tabName:".j_viewComment .ui-tab-item", noContent:false, currentName:".ui-tab-item-current", contentName:".wb-sub-comments-con", eventType:"click", callback: this.toChangeComment});

            wordsLimited.init({inputObj: "#J_wbIdea", tip: "#J_textNum", numLimited: "500", isCut: true});

            function displayCommentCallBack(obj) {
                var pageData = obj._current_data;
                var originalData = obj._cur_original_data;
                var htmlCotent =  "" ;
                if (pageData.length > 0) {
                    for (var i = 0, length = pageData.length; i < length; i++) {
                        htmlCotent += '<li><div class="wb-sub-comments-user"><span>' + pageData[i].username + '</span>' + pageData[i].inserttime + '</div>';
                        htmlCotent += '<p>' + pageData[i].commentcontent + '</p></li>';
                    }
                    if(that.wrongInfoData.commenttype == 0) {
                        $("#J_commentCount").html("(" + that.commentPaging._allCount + ")");
                    }
                    $("#J_commentSummaryCount").html("(" + that.commentPagingSummary._allCount + ")");

                } else {
                    htmlCotent = "暂无数据";
                    $("#J_commentSummaryCount").html("(0)");
                    $("#J_commentCount").html("(0)");
                }
                if(originalData.type == "0") {
                    $("#J_wbComment").html(htmlCotent);
                }
                else{
                    $("#J_wbCommentSummary").html(htmlCotent);
                }
            };
        },

        renderWrongInfo : function(){
            var url = window.location.href.split("?");
            var urlparam = url[1].split("&");
            var sectionId = (urlparam[0].split("="))[1];
            var sameSectionId = (urlparam[1].split("="))[1];
            this.type = (urlparam[2].split("="))[1];
            this.isNeeded = (urlparam[3].split("="))[1];
            this.idByType = (urlparam[4].split("="))[1];
            this.wbType = (urlparam[5].split("="))[1];

            this.getWrongInfoData(sectionId, sameSectionId);
        },

        getPath : function() {
            if(this.wrongInfoData.path != 0) {
                var urlparam = "&isneeded=" + this.isNeeded + "&wbtype=" + this.wbType;
                $("#J_viewCrumbsS").attr("href", $("#J_viewCrumbsS").attr("href") + urlparam);
                if (this.wrongInfoData.pathData.courseguid != undefined) {
                    $("#J_viewCrumbsC").attr("href", $("#J_viewCrumbsC").attr("href") + urlparam + "&subjectid=" + this.wrongInfoData.pathData.typeid);
                }
                if (this.wrongInfoData.pathData.lessonguid != undefined) {
                    $("#J_viewCrumbsL").attr("href", $("#J_viewCrumbsL").attr("href") + urlparam + "&subjectid=" + this.wrongInfoData.pathData.typeid + "&courseid=" + this.wrongInfoData.pathData.courseguid);
                }
            }
        },

        getWrongInfoData : function(sid, sameid) {
            var that = this;
            var pview = null;
            var viewWrongModel = new wrongInfoModel();
            viewWrongModel.fetch({
                data: $.param({type: this.type, isneeded: this.isNeeded, wbtype: this.wbType, idbytype: this.idByType, sectionguid: sid, samesectionguid: sameid}),
                success: function(model, response, options){
                    if (!response.success) {
                        alert("数据错误");
                        return ;
                    }
                    require.async("./practiceview", function(practiceView) {
                        pview = new practiceView();
                    });
                    var tempData = response.data;
                    var path = response.pathData;
                    tempData.halfModel = true;
                    tempData.username = that.userName;
                    if (tempData.samesectionid != "") {
                        tempData.commenttype = 1;  //练习错题
                    }
                    else{
                        tempData.commenttype = 0;  //课程错题
                    }
                    if(path == -1) {
                        tempData.path = 0;
                    }
                    else {
                        tempData.path = 1;
                        tempData.pathData = path;
                    }
                    that.wrongInfoData = tempData;
                    that.$el.html(_.template(viewTemplates, tempData));
                    that.render();
                    var redo = new popWindow({trigger:"#J_redoWrongBook",
                        popupBlk:"#J_exercisePop",
                        closeBtn:".j_exercisePopClose",
                        eventType:"click",
                        useOverlay:true,
                        isCentered:true,
                        isDrag:true,
                        onAfterPop : function(){
                            pview.setThisToClose(this);
                            pview.render(tempData);

                        },
                        onCloseCallBack : function() {
                            pview.stop();

                        }
                    });
                    if (tempData.samesectionid == "") {
                        var sameSectionPop = new popWindow({
                            trigger: "#J_sameSection",
                            popupBlk: "#J_sameSectionPop",
                            closeBtn: "#J_sameSectionPopClose",
                            eventType : "click",
                            useOverlay : true,
                            isCentered : true,
                            isDrag : true,
                            onAfterPop : that.displaySameSection(tempData)
                        });
                    }
                },
                error: function(){
                    alert("error");
                }
            });
        },

        getPreAndNextURL : function() {
            var preUrl = $("#J_viewPre").attr("href");
            var nextUrl = $("#J_viewNext").attr("href");
            var addUrl = "&t=" + this.type + "&isneeded=" + this.isNeeded + "&idbytype=" + this.idByType + "&wbtype=" + this.wbType;
            $("#J_viewPre").attr("href", preUrl + addUrl);
            $("#J_viewNext").attr("href", nextUrl + addUrl);
        },

        renderComment : function() {
            var currentData = this.wrongInfoData;
            if(currentData.commenttype == 0) {
                this.getCommentData(currentData.secid, currentData.samesectionid, this.isMyself, 0);
            }
            this.getCommentData(currentData.secid, currentData.samesectionid, this.isMyself, 1);
            this.currentCommentType = currentData.commenttype == 0 ? 0 : 1;
        },

        getCommentData : function(id, sameid, ismyself, type) {
            var requireDataString = (
                "sectionguid=" + id
                    + "&samesectionguid=" + sameid
                    + "&ismyself=" + ismyself   //0=全部心得/总结，1=我的心得/总结
                    + "&type=" + type       //0-错题心得，1-做题总结
                    + "&rnd=" + Math.round(Math.random() * 1000000000, 1)
                    + "&length=10"
                    + "&index="
                );
            if(type == 0) {
                this.commentPaging.set_request_param(requireDataString);
                this.commentPaging.showPage(0);
            }
            else {
                this.commentPagingSummary.set_request_param(requireDataString);
                this.commentPagingSummary.showPage(0);
            }
        },

        changeComment : function(type) {
            var currentData = this.wrongInfoData;
            if(type == 0) {
                this.commentPaging.del_cache_data();
                $("#j_dropdownCommentSort").html('全部心得<em class="ui-icon-triangle-dropdown"></em>');
            }
            else {
                this.commentPagingSummary.del_cache_data();
                $("#j_dropdownCommentSort").html('全部总结<em class="ui-icon-triangle-dropdown"></em>');
            }
            this.getCommentData(currentData.secid, currentData.samesectionid, 0, type);
        },

        reviewWrongBook : function() {
            if(this.updateViewTimeCacheData != true) {
                var ajaxParam = {
                    type: "PUT",
                    url: "/api/wrongbook/review/",
                    data: "sectionguid=" + this.wrongInfoData.secid + "&samesectionguid=" + this.wrongInfoData.samesectionid + "&rnd=" + Math.round(Math.random() * 1000000000, 1),
                    dataType: "json",
                    success : updateViewtimeCallback
                };
                $.ajax(ajaxParam);

                this.updateViewTimeCacheData = true;
            }

            function updateViewtimeCallback(data, status) {
                if(data.success){
                    this.updateViewTimeCacheData = true;
                    var need_review = $.cookie("need_review");
                    if(need_review) {
                        var section_id = data.secid.toString();
                        var samesection_id = data.samesectionid.toString();
                        var section_id_r = "re_"+section_id;
                        need_review = $.evalJSON(need_review);
                        var cur_need_review = need_review[section_id_r];
                        var new_cur_need_review = new Array();
                        for(var i in cur_need_review) {
                            if(cur_need_review[i] == (section_id + "_" + samesection_id + ":0")) {
                                new_cur_need_review[i] = section_id + "_" + samesection_id + ":1";
                            }
                            else {
                                new_cur_need_review[i] = cur_need_review[i];
                            }
                        }
                        need_review[section_id_r] = new_cur_need_review;
                        $.cookie('need_review', $.toJSON(need_review), {path:'/'});
                    }
                }
            }
        },

        showWrongBookAnswer : function(e) {
            var $showObj = $(".wb-sub-deltail-answer");
            if($showObj.hasClass("fn-hide")) {
                $showObj.find("img").attr("src", "http://image.jiandan100.cn/" + e.data.wrongInfoData.imagepathkey);
                $showObj.removeClass("fn-hide");
                e.data.reviewWrongBook();
            }
            else {
                $showObj.addClass("fn-hide");
            }
        },

        wrongBookListen : function(e) {
            e.data.reviewWrongBook();
        },

        getSortChangeData : function(e) {
            var $self = $(e.currentTarget);
            $self.parent().parent().siblings(".j_dropdownCommentSort").html($self.text() + '<em class="ui-icon-triangle-dropdown"></em>');
            e.data.isMyself = parseInt($self.attr("type"));
            if(e.data.currentCommentType == 0) {
                e.data.commentPaging.del_cache_data();
            }
            else {
                e.data.commentPagingSummary.del_cache_data();
            }
            e.data.getCommentData(e.data.wrongInfoData.secid, e.data.wrongInfoData.samesectionid, e.data.isMyself, e.data.currentCommentType);
        },

        displaySameSection : function(data) {
            var that = this;
            var sameData = data.samesectiondata;
            var numtozh = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
            var tabHtml = "";
            if (sameData) {
                for(var i = 0, len = sameData.length; i < len; i++) {
                    if(i == 0) {
                        tabHtml += '<li class="ui-tab-item ui-tab-item-current" type="' + sameData[i] + '"><a href="javascript:void(0);">同类题一</a></li>';
                    }
                    else {
                        tabHtml += '<li class="ui-tab-item" type="' + sameData[i] + '"><a href="javascript:void(0);">同类题' + numtozh[i + 1] + '</a></li>';
                    }
                }
                $(".j_sameSectionTab").html(tabHtml);
                that.getSameSectionDataCallback(sameData[0]);

                toggle_tab.init({tabName:".j_sameSectionTab .ui-tab-item", noContent:true, currentName:".ui-tab-item-current", eventType:"click", callback: getSameSectionData});

            } else {
                $(".ui-popwindow-con-del").html("没有同类题");
            }

            function getSameSectionData() {
                var $self = arguments[0];
                var sameSectionId = $self.attr("type");
                that.getSameSectionDataCallback(sameSectionId);
            };
        },

        getSameSectionDataCallback : function(sid) {
            var ajaxParam = {
                type: "GET",
                url: "/api/wrongbook/samesection/",
                data: "samesectionguid=" + sid + "&rnd=" + Math.round(Math.random() * 1000000000, 1),
                dataType: "json",
                success : function(data, status) {
                    $(".j_sameSectionTabTopic").attr("src", "http://image.jiandan100.cn/" + data.filepath + data.imagepathtitle);
                    $(".j_sameSectionTabAnswerImg").addClass("fn-hide");
                    $(".j_sameSectionTabAnswerImg img").attr("src", "http://image.jiandan100.cn/" + data.filepath + data.imagepathkey);
                }
            };
            $.ajax(ajaxParam);
        },

        changeSameSection : function(e) {
            var $displayObj = $(".j_sameSectionTabAnswerImg");
            if($displayObj.hasClass("fn-hide")) {
                $displayObj.removeClass("fn-hide");
            }
            else {
                $displayObj.addClass("fn-hide");
            }
        },

        submitComment : function(e) {
            var content = encodeURIComponent($("#J_wbIdea").val());
            var $share = $("#J_msgShare");
            if ($share.is(":checked")) {
                var isShared = 1;
            }
            else {
                var isShared = 0;
            }
            if (content == ""){
                alert("您没有填写内容，请先填写内容！");
                return;
            }
            var data = { "type":1,"sectionguid": e.data.wrongInfoData.secid,"rnd":Math.round(Math.random() * 1000000000, 1), "content" : content, "isshare": isShared, "courseguid": e.data.wrongInfoData.scid};
            var ajaxParam = {
                type: "POST",
                url: "/api/wrongbook/comment/",
                data:JSON.stringify(data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success : function(data) {
                    if(data.success) {
                        e.data.reviewWrongBook();
                        $("#J_wbIdea").val("");
                        e.data.commentPaging.del_cache_data();
                        e.data.getCommentData(e.data.wrongInfoData.secid, e.data.wrongInfoData.samesectionid, 0, 0);
                        $("#J_textNum span").html("500");
                        alert("提交成功！");
                    }
                    else {
                        alert("提交失败，请尝试重新提交。");
                    }
                }
            };
            $.ajax(ajaxParam);
        }
    });

    return wrongInfoView;
});
