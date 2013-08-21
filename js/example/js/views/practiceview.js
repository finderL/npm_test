/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-4-30
 * Time: 下午2:35
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var practiceTemplate = require("../../html/practice.html");
    var practiceSubjectTemplate = require("../../html/practicesubject.html");
    var practiceResultTemplate = require("../../html/practiceresult.html");
    var practiceModel = require('../models/practicemodel');
    var practiceCollection = require("../collections/practices");

    var pCollection = new practiceCollection([], {url : "/api/exercise/samesectioninfo/"});


    var practiceView = Backbone.View.extend({
        el : "#J_exercisePop",
        template : _.template(practiceTemplate),
        initialize : function(dataFrom) {

            this.pid = 0;
            this.halfModel = false;
            this.spendTime = 0;
            this.isshare = 1;
            this.score = 0;
            this.remark = '';
            this.t = '';
            this.useShow = 0;
            this.wrong = 0;
            this.defaultValue = '名师的思路和你有什么不同？你有不同的解法吗？';
            this.copyId = this.$el.attr("id") + "_copy";
            this.copyDom = "#" + this.copyId;
            this.collections = [];
            this.replaceDom = '';
            this.practicedQuestions = [];
            this.collections = pCollection;
            this.wrongData = undefined;
            this.workSpace = null;
            this.secid = '';
            this.secids = [];
            this.avageData = {};
           // this.listenTo(pCollection, 'reset', this.render());
        },

        events:{
            'click #show_subject':'show_subject',
            'click #finish':'dofinish',
            'keyup #answerText':'changeWordsNum',
            'keydown #answerText':'changeWordsNum',
            'keypress #answerText':'changeWordsNum',
            'focus #answerText':"onfocus",
            'blur #answerText':'onblur',
            'mouseup #answerText':'changeWordsNum',
            'click #gobacktoexercise':'gobacktoexercise',
            'click .pResult ':'showtips',
            "click .J_overPractice" : "practiceOver"
        },

        initVals : function() {
            this.stopTime();
            this.spendTime = 0;
            this.isshare = 1;
            this.score = 0;
            this.remark = '';
            this.t = '';
            this.useShow = 0;
            this.wrong = 0;
            $("#subject_text").addClass("fn-hide");
        },

        showtips : function(e){
            var $this = $(e.currentTarget);
            var radioVal = $this.children('input').val();
            $this.siblings(".answerTips").show();
            $this.parent().siblings().children(".answerTips").hide();
            $(".p_sbar_star").removeClass("s_1 s_2 s_3").addClass("s_"+radioVal);
        },

        goNext : function() {
            this.pid ++ ;
            this.initVals();
            this.render();
        },
        changeWordsNum : function(e) {
            var content_length = 140;
            var $itemtext_obj = $("#textNumSummary");
            var $item_obj = $("#answerText");
            var result = $item_obj.val().replace(/(^\s*)|(\s*$)/g, "");
            var length = parseInt(result.length);
            if(length > content_length){
                $item_obj.val(result.substring(0,content_length));
            }
            if(content_length >= length && $('#answerText').val() != this.defaultValue){
                var num = content_length - length;
                $itemtext_obj.html("");
                $itemtext_obj.html("还能输入<span class='fb fred'>" + num + "</span>字");
            }
        },
        onblur:function (e) {
            var self = this;
            if (e.data) {
                self = e.data;
            }
            if ($('#answerText').val() == "") {
                $('#answerText').css("color", "#999");
                $('#answerText').val(self.defaultValue);
                self.changeWordsNum();
            }
        },
        onfocus:function (e) {
            var self = this;
            if (e.data) {
                self = e.data;
            }
            $('#answerText').css("color", "#333");
            if ($('#answerText').val() == self.defaultValue) {
                $('#answerText').val("");
                self.changeWordsNum();
            }
        },
        renderDom : function(replaceDom,sectionguids, secid, dataFrom) {
            this.dataFrom = dataFrom;
            pCollection.url = dataFrom == "wrongbook" ? "/api/wrongbook/samesection/": "/api/exercise/samesectioninfo/";
            var self = this;
            if (_.isArray(secid)) {
                this.secids = secid;
            } else {
                this.secid  = secid;
            }

            if (replaceDom ) {
                this.replaceDom = replaceDom;
                this.halfModel = true;
            }
            var params1 = {guids : sectionguids};
            var params2 = {samesectionguid : sectionguids};
            var params = this.dataFrom == "wrongbook" ? params2 : params1;
            pCollection.fetch({reset: true,data : params, success : function(c, r) {
                if (dataFrom == "wrongbook") {
                    _.each(pCollection.models, function (model) {
                        model.set("sectiontitle", r.imagepathtitle);
                        model.set("sectionanswer", r.imagepathkey);
                    });
                }
                if (r.length <= 0 ) {
                    alert("暂无练习题");
                    self.close();
                    return ;
                }
                self.render();
            }});
        },

        render : function(wrongData) {
            if(wrongData == undefined) {

                if (this.pid < this.collections.length) {
                    var currentModel = this.collections.at(this.pid);
                    currentModel.set("halfModel", this.halfModel);
                    currentModel.set("commenttype", undefined);
                    if (this.halfModel) {
                        $(this.replaceDom).html(this.template(currentModel.toJSON()));
                    } else {
                        this.$el.hide();
                        this.$el.parent().append("<div id ='" + this.copyId + "'></div>");

                        $(this.copyDom).html(this.template(currentModel.toJSON()));
                        $(this.copyDom).off();
                        $(this.copyDom).on("click", "#show_subject", this, this.show_subject);
                        $(this.copyDom).on("click", "#finish", this, this.dofinish);
                        $(this.copyDom).on("click", ".pResult", this, this.showtips);
                        $(this.copyDom).on("click", ".j_exercisePopClose a", this,  this.close);
                        $(this.copyDom).on("keyup", "#answerText", this, this.changeWordsNum);
                        $(this.copyDom).on("keydown", "#answerText", this, this.changeWordsNum);
                        $(this.copyDom).on("keypress", "#answerText", this, this.changeWordsNum);
                        $(this.copyDom).on("mouseup", "#answerText", this, this.changeWordsNum);
                        $(this.copyDom).on("focus", "#answerText", this, this.onfocus);
                        $(this.copyDom).on("blur", "#answerText", this, this.onblur);
                        $(this.copyDom).on("click", ".J_overPractice", this, this.practiceOver);
                    }
                    this.startTime();
                    this.render_left();
                    this.render_score();
                } else {
                    $("#web_an_exercise").html(_.template(practiceResultTemplate, {data : this.collections.toJSON()}));
                }
            }
            else {
                $("#web_an_exercise").html(_.template(practiceTemplate, wrongData));
                this.wrongData = wrongData;
                if(wrongData.coverimage != null) {
                    $('.redo_img').attr('src','http://image.jiandan100.cn/data/images/cover/' + wrongData.coverimage);
                }
                this.collections = [];
                this.secid = wrongData.secid;
                $("#show_subject").on("click", "", this, this.show_subject);
                $("#finish").on("click", "", this, this.dofinish);

                $(".j_exercisePopClose a").on("click", "", this,  this.close);
                $("#answerText").on("keyup", "", this, this.changeWordsNum);
                $("#answerText").on("keydown", "", this, this.changeWordsNum);
                $("#answerText").on("keypress", "", this, this.changeWordsNum);
                $("#answerText").on("mouseup", "", this, this.changeWordsNum);
                $("#answerText").on("focus", "", this, this.onfocus);
                $("#answerText").on("blur", "", this, this.onblur);
                this.startTime();
            }

            //this.$el.html(this.template);
        },

        startTime : function () {
            this.spendTime += 1;
            $('#time_area').html("做题时间：<span>" + parseInt(this.spendTime / 60) + "</span>分<span>" + (this.spendTime % 60) + "</span>秒");
            var self = this;
            this.t = setTimeout(function () {
                self.startTime();
            }, 1000);
        },

        stopTime : function() {
            clearTimeout(this.t);
        },

        close : function(e) {
            this.pid = 0;

            if (e) {
                $(e.data.copyDom).remove();
                e.data.stop();
                e.data.$el.show();
            } else {
                $(this.copyDom).remove();
                this.stop();
                this.$el.show();
            }

        },

        practiceOverBack : function() {

        },
        practiceOver : function(e) {
            var self = this;

            if (e.data) {
                self = e.data;
            }
            self.close();
            if (self.workSpace) {
                self.workSpace.close();
            }
            self.practiceOverBack();
        },

        render_left : function() {
            var left_html = '';
            var htmlPoints = '<div class="ui-vertical-item-ellipsis">...</div>';
            var topicLength = this.collections.length-this.pid < 21 ? this.collections.length-this.pid : 19;
            if(topicLength > 1) {
                for(var i = 0; i < topicLength - 1; i++) {
                    left_html += "<div class=\"practice_num_l\">下一题</div>";
                }
            }
            if(topicLength == 19) {
                left_html = left_html + htmlPoints + "<div class=\"practice_num_l\">当前题</div>";
            }
            left_html += "<div class=\"practice_num_l t_last\">当前题</div>";
            $('#sbuject_left').html(left_html);
        },
        render_score : function() {
            var score_html = '';
            var htmlPoints = '<div class="ui-vertical-item-ellipsis">...</div>';
            var scoreLength = this.pid < 21 ? this.pid : 21;
            if(this.pid > 0) {
                for(var i = 0; i < scoreLength; i++) {
                    var curr_model = this.collections.at(i);
                    var score1 = curr_model.get('score');
                    var score_pic = 's_n' + score1;
                    score_html += '<div class="practice_num_l ' + score_pic + '">上一题分数</div>';
                }
                if(scoreLength == 21) {
                    score_html = score_html + htmlPoints;
                }
                $(".score_num").html(score_html);
            }
        },

        show_subject : function(e) {
            $("#subject_text").removeClass("fn-hide");
            if (e.data) {
                e.data.useShow = 1;
                return ;
            }
            this.useShow = 1;
        },

        stop : function() {
            this.pid = 0;
            this.stopTime();
            this.spendTime = 0;
        },

        isLocalData : function(mydata) {
            return mydata.length <= 0 ? true : false;
        },

        setThisToClose : function(workSpace) {
            this.workSpace = workSpace;
        },

        dofinish : function(e) {

            var self = this;
            if(e.data) {
                self = e.data;
            }

            self.stopTime();
            var currentModel = self.isLocalData(self.collections) ? new practiceModel({"secid":self.wrongData.secid, "courseguid" : "", id : self.wrongData.guid}) : self.collections.at(self.pid);
            var compiledTemplate = _.template(practiceSubjectTemplate, {data:{'useshow':self.useShow}});
            $('#submit_form').html(compiledTemplate);
            $('#submit_form').removeClass("fn-hide");
            $("#subject_text").removeClass("fn-hide");
            if(self.isLocalData(self.collections)) {
                $(".pResult").on("click", "", self, self.showtips);
                $("#answerText").on("keyup", "", self, self.changeWordsNum);
                $("#answerText").on("keydown", "", self, self.changeWordsNum);
                $("#answerText").on("keypress", "", self, self.changeWordsNum);
                $("#answerText").on("mouseup", "", self, self.changeWordsNum);
                $("#answerText").on("focus", "", self, self.onfocus);
                $("#answerText").on("blur", "", self, self.onblur);
            }

            var msgtemplate = '<div class="submit_tips popcon" id="submitTips"><div id="clearbox" class="ui-popwindow-close"><a href="javascript:box_clearDiv();" class="exambg"></a></div><div class="popmain"><h2 class="f14px fb">提示</h2><div class="popmain_con">';
            $('#answerSubmit').click(function () {
                //var sectionguid = currentModel.get("secid");
                //var samesectionguid = currentModel.get("id");
                var score = $("input[name=score]:checked").val();
                if(!score) {
                    alert("请选择您的得分");
                    return ;
                }
                currentModel.set("score", score);
                currentModel.set("spendingtime", self.spendTime);//var spendingtime = this.spendTime;
                currentModel.set("sectionguid", self.secid ? self.secid : self.secids[currentModel.get("guid")]);
                currentModel.set("samesectionguid", currentModel.get("id"));//var spendingtime = this.spendTime;
                //currentModel.set("courseguid", currentModel.get("courseguid"));//var spendingtime = this.spendTime;
                currentModel.set("usetip", 1);//var spendingtime = this.spendTime;
                var rem = $('#answerText').val().replace(/(^\s*)|(\s*$)/g, "");

                currentModel.set("remark", rem == self.defaultValue ? "" : rem);//var remark = $('#answerText').val().replace(/(^\s*)|(\s*$)/g, "");
                var isshare = 1;
                if ($('#topicShare').attr('checked') == 'checked') {
                    isshare = 1;
                } else {
                    isshare = 0;
                }
                currentModel.set("isshare", isshare);
                currentModel.set("datasrc", 3);
                currentModel.set("ssid", 0);
                currentModel.set("type", 0);
                currentModel.unset("id");

                currentModel.url = self.isLocalData(self.collections) || self.dataFrom == 'wrongbook' ? "/api/wrongbook/comment/" : '/api/exercise/exerciserecord/';
                currentModel.save({},{success : function(model, response, options) {
                        model.set('avageData', response.data);
                        if (self.isLocalData(self.collections) || self.dataFrom == 'wrongbook') {
                            self.workSpace.close();
                        } else {
                            self.goNext();
                        }
                    }
                });
            });
            return false;
        }
    });

    return practiceView;
});