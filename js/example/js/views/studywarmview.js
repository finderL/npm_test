/**
 * 课程列表页面
 * User: shy
 * Date: 13-4-7
 * Time: 下午12:07
 * 各种课程的页面展示
 */
define(function(require, exports, module) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var templates = require("../../html/studywarm.html");
    var warmItemTemplate = require("../../html/warmitem.html");
    var studyWarmModel = require('../models/studywarmlistmodel');
    var Popup = require("../components/popup.js");
    var Page = require("../components/paging.js");
    var JSON = require("json");
    var toggle_tab = require("../components/toggle_tab");
    var datepicker = require("/js/etsrc/other/bootstrap-datepicker");

    var exerciseView = Backbone.View.extend({
        el : '#content',
        initialize : function() {
            var that = this;
            this.render();
        },
        template : _.template(templates),
        events : {
            "click .j_del_studyWarm" : "delWarm"
        },

        limitWordsNumber : function(){
            var num = $(".j_studywarmText:visible").val().length;
            var count = 60 - num;
            var words = "还能输入"+ count +"字";
                $(".studywarmText_tips").html(words);
        },

        toggleWarmWay : function(num,e){
            toggle_tab.init({tabName:"#J_studywarmPopTab li", noContent:false, currentName:".ui-tab-item-current", contentName:".studywarm_del", eventType:"click"});
        },

        increase : function( count , max,  e){
            var num = parseInt(count,10);
            if( num < max && typeof num === "number" ){
                num = num +1;
                if( parseInt(num, 10) < 10){
                    num = "0"+num;
                }
                $(e.target).parents(".time").find("input").val(num);
            }
        },

        decrease : function( count , min, e){
            var num = parseInt(count, 10);
            if( num > min && typeof num === "number" ){
                num = num - 1;
                if( parseInt(num, 10) < 10){
                    num = "0"+num;
                }
                $(e.target).parents(".time").find("input").val(num);
            }
        },

        delWarm : function(e){
            if(confirm("您将要删除该条提醒,请确认")){
                var id =  $(e.target).parents("tr").attr("id");
                var rt =  $(e.target).parents("tr").attr("remind_type");
                var params = {id:id,rt:rt};
                $.ajax({
                    url: "/api/my/remind/",
                    dataType: "json",
                    type : 'DELETE',
                    data : params,
                    success: function(datas){
                        $(e.target).parents("tr").remove();
                    }
                }).fail(function(jqXHR, textStatus) {
                        alert( JSON.parse(jqXHR.responseText).error );
                    });

            }
        },

        toggleTime : function(){
            var that = this;
            var nowTemp = new Date();
            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
            $('#dp3').datepicker({
                onRender: function(date) {
                    return date.valueOf() < now.valueOf() ? 'disabled' : '';
                }
            });
            $('#dp4').datepicker({
                onRender: function(date) {
                    return date.valueOf() < now.valueOf() ? 'disabled' : '';
                }
            });
            $(".studywarm_hour .icon-arrow-up").click(function(e){
                var $target = $(e.target).parents(".time").find("input");
                var value1 = $target.val();
                that.increase(value1, 23, e);

            });
            $(".studywarm_minute .icon-arrow-up").click(function(e){
                var $target = $(e.target).parents(".time").find("input");
                var value2 = $target.val();
                that.increase(value2, 59, e);
            });
            $(".studywarm_hour .icon-arrow-down").click(function(e){
                var $target = $(e.target).parents(".time").find("input");
                var num = $target.val();
                that.decrease(num, 0, e);
            });
            $(".studywarm_minute .icon-arrow-down").click(function(e){
                var $target = $(e.target).parents(".time").find("input");
                var num = $target.val();
                that.decrease(num, 0, e);
            });
        },

        render : function() {
            var that = this;
            var studyWarm = new studyWarmModel();
            studyWarm.fetch({
                url: '/api/my/remind/all/',
                dataType: "json",
                success: function(model, response, options){
                    model.parseData(response);
                    var remind = model.get("remind");
                    remind = _.sortBy(remind, function (rem) {
                        return -rem.is_valid;
                    }) ;
                    _.each(remind, function(remindItem) {
                            $(".studywarm tbody").append(_.template(warmItemTemplate, remindItem));
                        var editWarm = new Popup({
                            trigger:".j_edit_studyWarm",
                            popupBlk:"#J_modifyWarmPop",
                            closeBtn:"#J_modifyWarmPopClose",
                            eventType:"click",
                            useOverlay:true,
                            isCentered:true,
                            isDrag:true,
                            onAfterPop : function(c, e){
                                var id = $(e.target).parents("tr").attr("id");
                                var remind_type = $(e.target).parents("tr").attr("remind_type");
                                if($("span.tips").length != 0){
                                    $("span.tips").remove();
                                }

                                that.toggleTime();
                                $.get("/api/my/remind/"+id+"/", function(data, status){
                                    if( status == "success"){
                                        if( remind_type == 0 ){
                                            $("#J_singleTime").removeClass("fn-hide");
                                            $("#J_repeatTime").addClass("fn-hide");
                                        }else{
                                            $("#J_repeatTime").removeClass("fn-hide");
                                            $("#J_singleTime").addClass("fn-hide");
                                        }

                                        var date = data.date;
                                        var content = data.content;
                                        var remind_way = data.remind_way;
                                        var hour = data.hour;
                                        var min =  data.min;
                                        var week_days = data.week_days;
                                        var arr_week = week_days.split(",");
                                        if( week_days.length >0 ){
                                            for( var i = 0; i < arr_week.length; i++  ){
                                                $(".week input:visible").eq(arr_week[i]-1).attr("checked",true);
                                            }
                                        }
                                        $(".singlemodifydate").val(date);
                                        $(".singlemodifydate").attr("data-date",date);
                                        $(".singlemodifyhour").val(hour);
                                        $(".singlemodifymin").val(min);
                                        $("#repeatmodifyhour").val(hour);
                                        $("#repeatmodifymin").val(min);
                                        $(".j_studywarmText:visible").val(content);
                                        if( remind_way == 1 ){
                                            $("#modifywarmWayEagent").attr("checked","checked");
                                        }else{
                                            $("#modifywarmWayEagent").attr("checked","");
                                        }
                                        $(".j_studywarmText").keyup(function(){
                                            if( $(".j_studywarmText:visible").val().length > 60 ){
                                                var value = $(".j_studywarmText:visible").val().substring(0,60);
                                                $(".j_studywarmText:visible").val(value) ;
                                            }

                                            that.limitWordsNumber()
                                        });
                                        $("#submitmodifyremind").click(function(){
                                            var a = [];
                                            var b = [];
                                            var time;
                                            if( $(".j_studywarmText:visible").val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'').length == 0 ){
                                                a.push("内容不能为空")
                                            }
                                            if(  remind_way == 1){
                                                if( $(".singlemodifydate:visible").val().length == 0 ){
                                                    a.push("日期不能为空")
                                                }
                                            }
                                            if( $(".week input:visible").length != 0 ){
                                                $(".week input:visible").each(function(i){
                                                    if( $(".week input:visible").eq(i).is(":checked")){
                                                        b.push(i+1);
                                                    }
                                                })
                                                if( b.length == 0 ){
                                                    a.push("没有选择星期几");
                                                }
                                                var h_r = $("#repeatmodifyhour").val().length == 1 ? ("0"+$("#repeatmodifyhour").val()) :$("#repeatmodifyhour").val();
                                                var m_r = $("#repeatmodifymin").val().length == 1 ? ("0"+$("#repeatmodifymin").val()) :$("#repeatmodifymin").val();
                                                if(!reg.test(h_r) || !reg.test(mm_r_single)){
                                                    alert("请填写数字");return false;
                                                }
                                                time = h_r + ":" + m_r ;
                                            }else{
                                                var h_s = $(".singlemodifyhour").val().length == 1 ? ("0"+$(".singlemodifyhour").val()) :$(".singlemodifyhour").val();
                                                var m_s = $(".singlemodifymin").val().length == 1 ? ("0"+$(".singlemodifymin").val()) :$(".singlemodifymin").val();
                                                if(!reg.test(h_r) || !reg.test(mm_r_single)){
                                                    alert("请填写数字");return false;
                                                }
                                                time =  h_s + ":" + m_s ;
                                            }
                                            if( $("#modifywarmWayEagent:checked").length == 0){
                                                a.push("没有选择提醒方式")
                                            }
                                            if( a.length == 0){
                                                var way;
                                                var date;
                                                if( remind_type == 0 ){
                                                    way = "";
                                                    date = $(".singlemodifydate:visible").val();
                                                    var dateDatas = date.split("-");
                                                    var timeDatas = time.split(":");
                                                        var date1 = Date.parse(new Date(parseInt(dateDatas[0],10),parseInt(dateDatas[1],10)-1,parseInt(dateDatas[2],10),parseInt(timeDatas[0],10),parseInt(timeDatas[1],10)));
                                                    var date2 = Date.parse(new Date());
                                                    if( date1 < date2 ){
                                                        if($("#J_singleTime dd:visible span.tips").length == 0){
                                                            $("#J_singleTime dd:visible").append("<span class='tips'>该时间发生在过去，请重新设置时间！</span>")
                                                            return false;
                                                        }
                                                        return false;
                                                    }else{
                                                        $("#J_singleTime dd:visible span.tips").html("");
                                                    }
                                                }else{
                                                    way = b.join(",");
                                                    date = "";
                                                }


                                            var remind_w = 1-$("#modifywarmWayEagent:checked").length;
                                            var data = {c:$(".j_studywarmText:visible").val(),d:date,rw:remind_way,rt:remind_type,t:time,w:way,id:id};
                                            $.ajax({
                                                url: "/api/my/remind/",
                                                type : 'PUT',
                                                data : data,
                                                success: function(datas){
                                                    $("#J_modifyWarmPopClose").trigger("click");
                                                    window.location.reload();
                                                }
                                            }).fail(function(jqXHR, textStatus) {
                                                    if($("#J_singleTime dd:visible span.tips").length == 0){
                                                        $("#J_singleTime dd:visible").append("<span class='tips'>该时间发生在过去，请重新设置时间！</span>")
                                                        return false;
                                                    }
                                                });
                                            }else{
                                                alert(a.join("，"));
                                            }
                                        });
                                    }else{
                                        alert("网络连接失败，请稍候再试！");
                                    }
                                }, "json");
                            }
                        });
                    });
                },
                error: function(){
                    alert("加载失败，请稍候再试！");
                }
            });

            this.$el.html(this.template);
            var newWarm = new Popup({trigger:"#studywarmAdd",
                popupBlk:"#J_studywarmPop",
                closeBtn:"#J_studywarmPopClose",
                eventType:"click",
                useOverlay:true,
                isCentered:true,
                isDrag:true,
                onAfterPop : function(){
                    toggle_tab.init({tabName:"#J_studywarmPopTab li", noContent:false, currentName:".ui-tab-item-current", contentName:".j_studywarmPopTabCon", eventType:"click"});
                    if($("span.tips").length != 0){
                        $("span.tips").remove();
                    }
                    that.toggleTime();
                    $(".j_studywarmText:visible").keyup(function(){
                        if( $(".j_studywarmText:visible").val().length > 60 ){
                            var value = $(".j_studywarmText:visible").val().substring(0,60);
                            $(".j_studywarmText:visible").val(value) ;
                        }
                        that.limitWordsNumber()
                    });
                    $("#submitnewremind").click(function(){
                        var a = [];
                        var b = [];
                        if( $(".studywarm tbody tr:visible").length >= 10 ){
                            a.push("你最多可以创建10个学习提醒，你可以删除已过期的提醒，或编辑其他的提醒");
                        }
                        if( $(".j_studywarmText:visible").val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'').length == 0 ){
                            a.push("内容不能为空");
                        }
                        if( $("#singlenewdate").val().length == 0 && $(".ui-tab-item-current").index() == 0 ){
                            a.push("日期不能为空");
                        }
                        if( $(".J_week input") && $(".ui-tab-item-current").index() == 1 ){
                            $(".J_week input").each(function(i){
                                if( $(".J_week input").eq(i).is(":checked")){
                                    b.push(i+1);
                                }
                            })
                            if( b.length == 0 ){
                                a.push("没有选择星期几")
                            }
                        }
                        if( $("#studywarmWayEagent:checked").length == 0){
                            a.push("没有选择提醒方式")
                        }
                        if( a.length == 0){
                            var way;
                            var date;
                            var timeNew;

                            if( $(".week input:visible").length != 0 ){
                                var h_repeat = $("#repeatnewhour").val().length == 1 ? ("0"+$("#repeatnewhour").val()) :$("#repeatnewhour").val();
                                var m_repeat = $("#repeatnewmin").val().length == 1 ? ("0"+$("#repeatnewmin").val()) :$("#repeatnewmin").val();
                                timeNew = h_repeat + ":" + m_repeat ;
                            }else{
                                var h_single = $("#singlenewhour").val().length == 1 ? ("0"+$("#singlenewhour").val()) :$("#singlenewhour").val();
                                var m_single = $("#singlenewmin").val().length == 1 ? ("0"+$("#singlenewmin").val()) :$("#singlenewmin").val();
                                var reg = new   RegExp("^[0-9]{0,2}$");
                                if(!reg.test(h_single) || !reg.test(m_single)){
                                    alert("请填写数字");return false;
                                }
                                timeNew =  h_single + ":" + m_single ;
                            }

                            if( $(".ui-tab-item-current").index() == 0 ){
                                way = "";
                                date = $("#singlenewdate").val()
                                var dateDatas = date.split("-");
                                var timeDatas = timeNew.split(":");
                                var date1 = Date.parse(new Date(parseInt(dateDatas[0],10),parseInt(dateDatas[1],10)-1,parseInt(dateDatas[2],10),parseInt(timeDatas[0],10),parseInt(timeDatas[1],10)));
                                var date2 = Date.parse(new Date());
                                if( date1 < date2 ){
                                    if( $(".j_studywarmPopTabCon dd:visible span.tips").length == 0){
                                        $(".j_studywarmPopTabCon dd:visible").append("<span class='tips'>该时间发生在过去，请重新设置时间！</span>")
                                        return false;
                                    }
                                    return false;
                                }else{
                                    $("#j_studywarmPopTabCon dd:visible span.tips").html("");
                                }
                            }else{
                                way = b.join(",");
                                date = "";
                            }
                            var params = {c:$(".j_studywarmText:visible").val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,''),d:date,rt:$(".ui-tab-item-current").index(),rw:(1-$("#studywarmWayEagent:checked").length),t:timeNew,w:way};
                            $.ajax({
                                type: "POST",
                                url:"/api/my/remind/",
                                data:params
                            }).done(function() {
                                $("#J_studywarmPopClose").trigger("click");
                                window.location.reload();
                            }).fail(function(jqXHR, textStatus) {
                                alert( "该时间发生在过去，请重新设置时间！" );
                                if( $(".j_studywarmPopTabCon dd:visible span.tips").length == 0){
                                    $(".j_studywarmPopTabCon dd:visible").append("<span class='tips'>该时间发生在过去，请重新设置时间！</span>")
                                    return false;
                                }
                            });
                        }else{
                            alert(a.join("，"));
                        }
                    });
                }
            });
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