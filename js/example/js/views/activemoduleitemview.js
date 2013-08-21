/**
 * 激活页面的显示
 * User: sihuayin
 * Date: 13-7-2
 * Time: 下午1:56
 * 显示点击以后的内容
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var JSON = require("json");
    var templates = require("../../html/activemoduleitem.html");
    var modelCard = require("../components/card.js");

    var moduleItemView = Backbone.View.extend({
        el : "#J_topcontainer1",
        template :_.template(templates),
        events : {
            "click td input[type=checkbox]" : "refreshSelectCourses",
            "click #J_submit" : "doSubmit",
            "click #J_cancel" : "doCanel"
        },

        initialize : function (data, parentDom) {
            this.activeData = data;
            this.displayData = {};
            this.submitData = {};
            this.parentDom = parentDom;
            this.submitData.required = [];
            this.submitData.elective = [];
            if (_.has(this.activeData, "title")) { //检查激活数据中是否有title 区分两种激活的情况
                //如果数据中含有title，说明是有版本的激活方式
                this.displayData.title = this.activeData.course_name + " ( " +this.activeData.title + " )";
                this.displayData.items = this.activeData.items;
                for (var i = 0, len = this.activeData.items.length; i < len; i++) {
                    var temp = [];
                    if (this.activeData.items[i].required.length > 0) {
                        for (var j = 0, jen = this.activeData.items[i].required.length; j < jen; j++) {
                            temp.push(this.activeData.items[i].required[j].id);
                        }

                    }
                    this.submitData.required = this.submitData.required.concat(temp);
                }
            } else {
                this.displayData.title = this.activeData.course_name;
                this.displayData.items = [this.activeData];
                var temp = [];
                if (this.activeData.required.length > 0) {
                    for (var j = 0, jen = this.activeData.required.length; j < jen; j++) {
                        temp.push(this.activeData.required[j].id);
                    }

                }
                this.submitData.required = this.submitData.required.concat(temp);
            }
            this.render();
        },

        remove: function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        },
        render : function () {
            this.$el.html(this.template(this.displayData));
            var card = modelCard.init({"trigger":".j_modelLesson","popblk":".modelLesson-pop", "renderFun" : this.showLessons});
        },

        removeItem : function (data, guid) {
            for(var i = 0; i < data.length; i ++){
                if(data[i] == guid) break;
            }
            data.splice(i,1);
            return data;
        },

        refreshSelectCourses : function (e) {
            var currentCourse = $(e.currentTarget).attr("cid");
            var groupid = $(e.currentTarget).attr("groupid");
            if (e.currentTarget.checked) {
                if (_.has(this.activeData, "title")) {
                    if (!this.submitData.elective[groupid]) {
                        this.submitData.elective[groupid] = [];
                    }

                    if (this.submitData.elective[groupid].length + 1 > this.activeData.items[groupid].elective.max) {
                        alert("你选择的可选的模块个数超过规定的数目");
                        e.currentTarget.checked = false;
                        return;
                    }

                    this.submitData.elective[groupid].push(currentCourse);
                } else {
                    if (this.submitData.elective.length + 1 > this.activeData.elective.max) {
                        alert("你选择的可选的模块个数超过规定的数目");
                        e.currentTarget.checked = false;
                        return;
                    }
                    this.submitData.elective.push(currentCourse);
                }
            } else {
                if (_.has(this.activeData, "title")) {
                    this.removeItem(this.submitData.elective[groupid] , currentCourse);
                } else {
                    this.removeItem(this.submitData.elective, currentCourse);
                }
            }
        },

        hasAcitved : function (e) {
            this.parentDom.children("td").last().html("<div style='color:red'>已确定模块</div>");
            this.removeAuthor();
            this.remove();
        },

        removeAuthor : function () {
            if (_.has(this.activeData, "title")) {
                var courseName = this.parentDom.find("span").first().html();
            } else {
                var courseName = this.parentDom.find("a").first().html();
            }

            this.parentDom.children("td").first().html(courseName);
        },

        doSubmit : function (e) {
            var that = this;
            var data = JSON.stringify(this.submitData);
            var aModel = new Backbone.Model();
            aModel.set("cid", this.activeData.course_guid);
            aModel.set("activecode", this.activeData.active_code);
            aModel.set("title", _.has(this.activeData, "title") ? this.activeData.title : "");
            aModel.set("mg", data);
            aModel.url = baseUrl + "/api/my/active/";
            aModel.save({}, {
                success : function(model, response, options) {
                    if ( response.success ) {
                        that.hasAcitved(e);
                    } else {
                        if (response.failDesc) {
                            alert(response.failDesc);
                        } else {
                            alert('激活失败');
                        }
                    }
                },
                error : function() {
                    alert("系统错误，请稍后重试");
                }
            });
        },

        showLessons : function (e, $card) {
            $dom = $(e.currentTarget);
            var cid = $dom.attr("cid");
            var tempModel = new Backbone.Model();
            var tempCollection = new Backbone.Collection({model : tempModel});
            tempCollection.url = baseUrl + '/api/my/active/getlessons/';
            tempCollection.fetch({data : {cid :cid}, success : function(c, response){
                $card.find("ul").html("");
                _.each(response, function(lesson,index) {
                   $card.find("ul").append("<li>第 " + (++index) + " 讲. "+ lesson + "</li>");
                });
                $card.find("ul").append("<li class='fn-link-blue'><a href='"+baseUrl+"/lesson/c/" + cid +"' target='_blank'>查看更多</a></li>");
            }});
        },

        doCanel : function () {
            this.remove();
        },

        remove  : function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }
    });
    return moduleItemView;
});