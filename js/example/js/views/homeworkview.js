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
    var templates = require("../../html/homework.html");
    var Page = require("../components/paging");
    var Card = require("../components/card");
    var homwworkModels = require("../models/homeworkmodel");
    var JSON = require("json");
    var homwworkData = new homwworkModels();

    var exerciseView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            var that = this;
            this.pview = null;
            this.status = 0 ;
            this.id = 1 ;
            this.guid = "" ;
            this.render();
        },
        template : _.template(templates),
        events : {
            "mouseenter .ex-detail-list-con" : "enter",
            "mouseleave .ex-detail-list-con" : "leave",
            "click .j_homeworkTab li.ui-tab-item" : "toggleHomeworkTab",
            "click #prompt .ui-icon-close" : "closePrompt",
            "click #J_promptKnow" : "closePrompt",
            "click .j_homeworkTab .ui-tab-item" : "showContents",
            "click .j_type_select a.step" : "selectType",
            "click .J_honework_panel .status_select a" : "toggleStatus",
            "click .J_honework_panel .lesson_select a" : "toggleSubjects",
            "click .J_honework_panel .lesson a" : "toggleLesson"
        },

        toggleStatus : function(e){
            var that = this;
            var $this = $(e.target);
            $this.parent().addClass("current").siblings().removeClass("current");
            that.status = $this.parent("a").attr("status");
            that.renderHomeworkPage();
        },

        toggleSubjects : function(e){
            var that = this;
            var $this = $(e.target);
            $this.parent().addClass("current").siblings().removeClass("current");
            that.id = $this.parent().attr("id");
            that.renderCourses(homwworkData, that.id);
            that.renderHomeworkPage();
        },

        toggleLesson : function(e){
            var that = this;
            var $this = $(e.target);
            $this.parent().addClass("current").siblings().removeClass("current");
            that.guid = $this.parent().attr("guid");
            that.renderHomeworkPage();

        },

        toggleHomeworkTab : function(e){
            var that = this;
            var num = $(e.currentTarget).index(".ui-tab-item");
            if( !$(e.currentTarget).hasClass("ui-tab-item-current") ){
                $(e.currentTarget).addClass("ui-tab-item-current");
                $(e.currentTarget).siblings(".ui-tab-item").removeClass("ui-tab-item-current");
                $(".J_honework_panel").hide();
                $(".J_honework_panel").hide().eq(num).show();
            }else{
                return;
            }
        },

        renderSubjects : function(datas){
            var subjects = datas.get("subjects");
            if( subjects.length > 0){
                $(".J_honework_panel .lesson_select").html("");
                for( var i = 0; i < subjects.length;i++){
                    var item = subjects[i];
                    if(i == 0){
                        $(".J_honework_panel .lesson_select").append("<a href='javascript:;' class='current' id='"+item.id+"'><span>"+item.type+"</span></a>");
                    }
                    if(i != 0){
                        $(".J_honework_panel .lesson_select").append("<a href='javascript:;' id='"+item.id+"'><span>"+item.type+"</span></a>");
                    }
                }
            }

        },

        renderCourses : function(data, targetid){
            var that = this;
            var temp = data.get("courses");
            var courses = _.pluck(temp,"id");
            var tem_courses = [];
            for(var k = 0;k<courses.length;k++){
                if( courses[k]== targetid){
                    tem_courses.push(temp[k]);
                }
            }
            if( tem_courses.length > 0){
                $(".J_honework_panel .lesson").html("");
                for( var i = 0; i < tem_courses.length;i++){
                    var item = tem_courses[i];
                    var id = item.id;
                    if( id == targetid && i == 0){
                        that.guid = item.guid;
                        $(".J_honework_panel .lesson").append("<a href='javascript:;' class='current' id='"+item.id+"' guid='"+item.guid+"' realguid='"+item.realguid+"' authtype='"+item.authtype+"'><span>"+item.coursename+"</span></a>");
                    }
                    if( id == targetid && i != 0){
                        $(".J_honework_panel .lesson").append("<a href='javascript:;' id='"+item.id+"' guid='"+item.guid+"' realguid='"+item.realguid+"' authtype='"+item.authtype+"'><span>"+item.coursename+"</span></a>");
                    }
                }
            }
        },

        selectType : function (e){
            var that = this;
            var num = $(e.currentTarget).index();
            var type = num-1;
            that.type = type;
            $(".j_type_select a.step").removeClass("c");
            $(".j_type_select a.step").eq(num-1).addClass("c").show();
            if( that.type != 0 ){
                $(".J_type_content").show()
                that.getSummary(num);
            }else{
                $(".J_type_content ul").html("");
                $(".J_type_content").hide();
            }
            that.getDetails();
        },

        getSumaryInfo : function(data, status){
            var $content_list = $(".J_type_content ul");
            if( status ){
                var html = "";
                var data = data;
                switch( data.type){
                    case 1:
                        if(data.listen_total_time >= 60)
                            html += "<li>听课时长：<span>"+Math.floor(data.listen_total_time/60)+"分钟"+data.listen_total_time%60+"秒</span></li>";
                        else
                            html += "<li>听课时长：<span>"+data.listen_total_time%60+"秒</span></li>";
                        html+="<li>听课小节数：<span>"+data.listen_section_num+"</span></li>"
                            +"<li>先做题再听课做题数：<span>"+data.xianzuotishu+"</span></li>"
                            +"<li>先做题再听课做题比例：<span>"+data.xianzuotibili+"</span></li>"
                            +"<li>先做题再听课做题正确率：<span>"+data.xianzuotizhengquelv+"</span></li>"
                            +"<li>先做题再听课错题总结率：<span>"+data.cuotizongjielv+"</span></li>";
                        break;
                    case 2:
                        html += "<li>练习做题数：<span>"+data.total_num+"</span></li>"
                            +"<li>练习做题比例：<span>"+data.exercise_percent+"</span></li>"
                            +"<li>练习做题正确率：<span>"+data.right_percent+"</span></li>"
                            +"<li>练习错题总结率：<span>"+data.remark_persent+"</span></li>";
                        break;
                    case 3:
                        html += "<li>答疑提问数：<span>"+data.total_question_count+"</span></li>"
                            +"<li>答疑回答数：<span>"+data.total_reply_count+"</span></li>";
                        break;
                    case 4:
                        html += "<li>复习错题数：<span>"+data.total_review_count+"</span></li>"
                            +"<li>未复习错题数：<span>"+data.total_unreview_count+"</span></li>";
                        break;
                }
                $content_list.html(html);
            }else{
                $content_list.html("<span style='color:#ff0000;'>获取数据失败，请稍后再试！</span>");
            }
        },

        getSummary : function(num){
            var that = this;
            var params = {t : that.type};
            $(".J_type_content ul").html("");
            $(".J_type_content").show();
            $.get("/api/my/history/summary/", params,  function(data,status){
                that.getSumaryInfo(data,status);
            },"json");
        },

        getDetails : function(){
            var that = this;

            var pageRecord = new Page("/api/my/history/detail/", "t="+that.type+"&c=10&i=", 10, ".j_studyrecordPager", "#J_noStudyrecord","#J_studyrecordcontent", that.displayContent);
            pageRecord.showPage(0);
        },

        displayContent : function (obj){
            var $contentObj = $("#J_studyrecordcontent");
            var htmlContent = "";
            var page_data = obj._current_data;
            for(var i = 0; i < page_data.length; i ++){
                var data = page_data[i];
                switch(data.type){
                    case 1:
                        if( data.record.reviewtype==0 ){
                            htmlContent += '<div class="sig_record"><span class="date">'+data.insert_time+'</span>';
                            if(data.record.totaltime >= 60)
                                htmlContent +='<span class="des">观看了&nbsp;<i class="blue">'+Math.floor(data.record.totaltime/60)+'分钟'+data.record.totaltime%60+'秒的</i>&nbsp;<i class="blue">'+data.record.sectionname+'</i>课程，<i class="red">没有</i>&nbsp;提前做题。</span></div>';
                            else
                                htmlContent +='<span class="des">观看了&nbsp;<i class="blue">'+data.record.totaltime%60+'秒的</i>&nbsp;<i class="blue">'+data.record.sectionname+'</i>课程，<i class="red">没有</i>&nbsp;提前做题。</span></div>';
                        }
                        if( data.record.reviewtype >0 ){
                            htmlContent += '<div class="sig_record"><span class="date">'+data.insert_time+'</span>';
                            if(data.record.totaltime >= 60)
                                htmlContent +='<span class="des">观看了&nbsp;<i class="blue">'+Math.floor(data.record.totaltime/60)+'分钟'+data.record.totaltime%60+'秒的</i>&nbsp;<i class="blue">'+data.record.sectionname+'</i>课程，<i class="red">有</i>&nbsp;提前做题。</span></div>';
                            else
                                htmlContent +='<span class="des">观看了&nbsp;<i class="blue">'+data.record.totaltime%60+'秒的</i>&nbsp;<i class="blue">'+data.record.sectionname+'</i>课程，<i class="red">有</i>&nbsp;提前做题。</span></div>';
                        }
                        break;
                    case 2:
                        htmlContent += '<div class="sig_record">'
                            +'<span class="date">'+data.insert_time+'</span>'
                            +'<span class="des">做了&nbsp;<i class="blue">'+data.record.sectionname+'</i>&nbsp;的课后练习</span>'
                            +'</div>';
                        break;
                    case 3:
                        if(data.record.type == "reply"){
                            htmlContent += '<div class=\"sig_record\">'
                                +'<span class=\"date\">'+data.insert_time+'</span>'
                                +'<span class=\"des\">回答了一道&nbsp;<i class=\"blue\">'+data.record.grade+'</i>-<i class=\"blue\">'+data.record.subject+'</i>-<i class=\"blue\">'+data.record.knowledgepoint+'</i>&nbsp;下的&nbsp;';
                            if(data.record.questiontype == "0"){
                                htmlContent +='<i class="red">问同学的问题。</i></span></div>';
                            }else{
                                htmlContent +='<i class="red">问老师的问题。</i></span></div>';
                            }
                        }else{
                            htmlContent += '<div class="sig_record">'
                                +'<span class=\"date\">'+data.insert_time+'</span>'
                                +'<span class=\"des\">提问了一道&nbsp;<i class=\"blue\">'+data.record.grade+'</i>-<i class=\"blue\">'+data.record.subject+'</i>-<i class=\"blue\">'+data.record.knowledgepoint+'</i>&nbsp;下的&nbsp;';
                            if(data.record.questiontype == "0"){
                                htmlContent +='<i class="red">问同学的问题。</i></span></div>';
                            }else{
                                htmlContent +='<i class="red">问老师的问题。</i></span></div>';
                            }
                        }
                        break;
                    case 4:
                        htmlContent += '<div class="sig_record">'
                            +'<span class="date">'+data.insert_time+'</span>'
                            +'<span class="des">复习了一道&nbsp;<i class="blue">'+data.record.sectionname+'</i>&nbsp;的错题。</span>'
                            +'</div>';
                        break;

                }
            }
            $contentObj.html(htmlContent);
        },

        showContents : function (e){
            var num = $(e.currentTarget).index()-1;
            var $parent = $(e.target).parent(".ui-tab-item");
            if( !$parent.hasClass("ui-tab-item-current")){
                $parent.addClass("ui-tab-item-current");
                $parent.siblings(".ui-tab-item").removeClass("ui-tab-item-current");
                $(".J_honework_panel").hide();
                $(".J_honework_panel").eq(num).show();
            }
            if( num == 1){
                this.getDetails();
            }
        },

        renderHomeWork : function(){
            var that = this;

            homwworkData.fetch({
                url: '/api/my/homework/courses/',
                success: function(model, response, options){
                    that.renderSubjects(model);
                    that.renderCourses(model,that.id);
                    that.renderHomeworkPage();

                },
                error: function(errors){
                    alert(errors);
                }
            });

        },

        renderHomeworkPage: function(){
            var that = this;
            Homework = new Page("/api/my/homework/detail/","cg="+that.guid+"&ic="+that.status+"&c=10&i=", 10, ".j_homeworkPager", "#J_noHomework","#J_homework", that.renderHomeworkDetail);
            Homework.showPage(0);
        },
        renderHomeworkDetail : function(obj){
            var that = this;
            var contentObj = $("#J_homework");
            var htmlHead = "<table summary=\"课后作业\" width=\"100%\" class=\"ui-table ui-table-border\"><tr><th>有作业的课程</th><th width=\"30%\">课后练习</th><th width=\"30%\">错题复习</th></tr>";
            var htmlContent = "";
            var page_data = obj._current_data;


            if( page_data.length > 0 ){
                for(var i = 0; i < page_data.length; i ++){
                    var data = page_data[i];
                    htmlContent += "<tr><td class=\"textleft\">"+data.section_name+"</td>";
                    if(data.exercise_status == 1)
                        htmlContent += "<td><span class=\"hk_icon hk_icon_done j_hkCardTrigger\" section_id = "+data.section_id+"  same_section = "+data.exercise_guids+" id=\"exercise_"+data.section_id+"\">已完成</span></td>";
                    else
                        htmlContent += "<td><span class=\"hk_icon hk_icon_undone j_hkCardTrigger\" section_id = "+data.section_id+" same_section = "+data.exercise_guids+" id=\"exercise_"+data.section_id+"\">未完成</span></td>";
                    if(data.review_status == 0)
                        htmlContent += "<td><span class=\"hk_icon hk_icon_undone j_hkCardTrigger\" section_id = "+data.section_id+"  same_section = "+data.review_guids+" id=\"review_"+data.section_id+"\">未完成</span></td>";
                    if(data.review_status == 1)
                        htmlContent += "<td><span class=\"fcor_999\" id=\"review_"+data.section_id+"\">暂不需要复习</span></td>";
                    if(data.review_status == 2)
                        htmlContent += "<td><span class=\"hk_icon hk_icon_done j_hkCardTrigger\" section_id = "+data.section_id+"  same_section = "+data.review_guids+" id=\"review_"+data.section_id+"\">已完成</span></td>";
                    htmlContent += "</tr>";
                }
            }
            contentObj.html(htmlHead+htmlContent+"</table>");
        },

        renderCard : function(e, $card){
            var that = this;
            var $this = $(e.target);
            var wrong_reveiw_link = $this.parents("td").index();  //1为练习，2为复习
            var data_id = $this.attr("section_id");
            var sectionid = $this.attr("section_id");
            var cur_is_complete = that.status;
            var first_course_guid = that.guid;
            var sameSection = $this.attr("same_section");
            var exercise_data = sameSection.split(',');


            var $section_hover = $card;
            html = "";
            switch ( wrong_reveiw_link ){
                case 1 :
                    for(var i=0;i<exercise_data.length;i++){
                        var index = exercise_data[i].lastIndexOf(":");
                        var samesecionid = exercise_data[i].substring(0,index);
                        var score = exercise_data[i].substr(index+1);
                        if(score == "1"){
                            html += "<tr><td width=\"25%\"><span class=\"icon_studymanage icon_exercised\">已练习</span></td><td width=\"30%\">第" + (i + 1) + "题</td>";
                            html += "<td width=\"45%\"><a samesecionid=" + samesecionid + " sectionid=" + sectionid  + " href=\"javascript:;\" class=\"ui-button ui-button-sblue J_practice\"><span>再次练习</span></a></td>";
                        }
                        else{
                            html += "<tr><td width=\"25%\"><span class=\"icon_studymanage icon_exercise\">未练习</span></td><td width=\"30%\">第" + (i + 1) + "题</td>";
                            html += "<td width=\"45%\"><a samesecionid=" + samesecionid + " sectionid=" + sectionid  + " href=\"javascript:;\" class=\"ui-button ui-button-sblue J_practice\"><span>立即练习</span></a></td>";
                        }
                    }
                    break;
                case 2 :
                    for(var i=0;i<exercise_data.length;i++){
                        var index = exercise_data[i].lastIndexOf(":");
                        var guid = exercise_data[i].substring(0,index);
                        var samesectionid =(sectionid == guid)?"":guid;
                        var score = exercise_data[i].substr(index+1);
                        if(score == "1"){
                            html += "<tr><td width=\"25%\"><span class=\"icon_studymanage icon_exercised\">已复习</span></td><td width=\"30%\">第" + (i + 1) + "题</td>";
                            html += "<td width=\"45%\"><a href=\"#/wrong/?sectionid=" + sectionid + "&samesectionid=" + samesectionid + "&t=5&isneeded=0&idbytype=-1&wbtype=2\" class=\"ui-button ui-button-sblue\"><span>再次复习</span></a></td>";
                        }
                        else{
                            html += "<tr><td width=\"25%\"><span class=\"icon_studymanage icon_exercise\">未复习</span></td><td width=\"30%\">第" + (i + 1) + "题</td>";
                            html += "<td width=\"45%\"><a href=\"#/wrong/?sectionid=" + sectionid + "&samesectionid=" + samesectionid + "&t=5&isneeded=0&idbytype=-1&wbtype=2\" class=\"ui-button ui-button-sblue\"><span>立即复习</span></a></td>";
                        }
                    }
                    break;
            }
            $section_hover.addClass(".J_homeworkSection");
            $section_hover.find("tbody").html($(html));
            $("body").append($section_hover);
            $section_hover.attr("wrong_reveiw_link",wrong_reveiw_link);
            var t2 = new Popup({
                trigger:".J_practice",
                popupBlk:"#J_exercisePop",
                closeBtn:".j_exercisePopClose a",
                eventType:"click",
                useOverlay:true,
                isCentered:true,
                isDrag:true,
                onAfterPop : function(c, e){
                    that.goPractice(e, this);
                },
                onCloseCallBack : function() {
                    if (that.pview) {
                        that.pview.stop();
                    }
                }
            })
        },
        doexercise: function(){
            var that = this;

        },

        goPractice : function (e, popWindow) {
            var sameid = $(e.currentTarget).attr("samesecionid");
            var sectionid = $(e.currentTarget).attr("sectionid");
            var that = this;
            require.async("./practiceview", function(practiceView) {
                that.pview = new practiceView();
                that.pview.renderDom(".j_exercisePopDel", sameid, sectionid, "wrongbook");
                that.pview.setThisToClose(popWindow);
            });
        },

        render : function() {
            var that = this;
            this.$el.html();
            this.$el.html(this.template);
            this.renderHomeWork();
            var card = Card.init({
                "trigger":".j_hkCardTrigger",
                "popblk":".section_hover",
                "renderFun":function(e, $card){that.renderCard(e,$card)}});
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