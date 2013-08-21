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
    var templates = require("../../html/mycourse.html");
    var courseListTemplate = require("../../html/courselist.html");
    var courseItemView = require("./courseitemview");
    var courseList = require("../collections/courses");

    exports.init = function (path) {
        var baseSaleUrl = "#/courses/formal/";

        var mycourses = new courseList();

        var courseView = Backbone.View.extend({
            el : '#content',
            initialize : function() {
                var that = this;
                var inits = path.split("/");
                this.subjectid = -1;
                this.yearid = -1;
                this.publishid = -1;
                this.sortHistories = {};
                this.sortType = 'lastListenTime';
                this.sortHistories[this.sortType] = 'down';
                this.sortUpOrDown = "down";
                if(inits.length >0 && inits[0] != 'formal') {
                    alert("go");return ;
                } else {
                    _.each(inits, function(someid) {
                        if (someid.indexOf("sid-") == 0) {
                            that.subjectid = _.last(someid.split("-"));
                        } else if(someid.indexOf("yid-") == 0){
                            that.yearid = _.last(someid.split("-"));
                        } else if(someid.indexOf("pid-") == 0) {
                            that.publishid = _.last(someid.split("-"));
                        } else if (someid.indexOf("sort-") == 0) {
                            that.sortType = someid.split("-")[1];
                            that.sortUpOrDown = _.last(someid.split("-"));
                            that.sortHistories[that.sortType] = that.sortUpOrDown;
                        }
                    });
                }

                this.listenTo(mycourses, 'reset', this.render);
                //this.courses = mycourses;
                mycourses.url += "formal/";
                mycourses.fetch({reset : true});

            },
            template : _.template(templates),
            events : {
                "click .courseFilter-item a"  :  "subjectOnly",
                "click .courseSort a" : "sortEvent"
            },
            render : function() {
                this.data = {};
                this.data.courseType = 'formal';
                this.data.subjects = this.getFilterdata('subject');
                this.data.grades = this.getFilterdata('year');
                this.data.publishStates = this.getFilterdata('publishState');
                if (mycourses.length > 0) {
                    this.renderFilter();
                    this.$el.html(this.template(this.data));
                    this.renderSortBefore();
                } else {
                    this.data.courseHtml = "";
                    this.$el.html(this.template(this.data));
                    $(".courseFilter").addClass("fn-hide");
                    $(".courseSort").addClass("fn-hide");
                    $(".courseList").html("没有正式课程");
                }

            },

            renderCourses : function (models) {
                var that = this;
                var courseListData = '';
                _.each(models, function(courseItem) {
                    courseItem.set("courseType",  that.data.courseType);
                    var cou = new courseItemView({model : courseItem});
                    courseListData += cou.$el.html();
                },this);
                this.data.courseList = courseListData;
                this.data.courseHtml = _.template(courseListTemplate, this.data);
                this.$el.find(".courseList").html(this.data.courseHtml);

            },
            getFilterdata : function(type) {
                var typeData = "";
                var types = this.getType(type);
                var that  = this;
                var tempTypes = [];
                var hasOther = false;
                types.unshift("-1");
                if (type == 'subject') {
                    _.each(types, function(t) {
                        if (t == "其他") {
                            hasOther = true;
                        } else {
                            tempTypes.push(t);
                        }
                    });
                    if (hasOther) {
                        tempTypes.push("其他");
                    }
                    types = tempTypes;
                } else if (type == "year") {
                    types.sort();
                }
                _.each(types, function(s){
                    typeData += "&nbsp;&nbsp;&nbsp;";
                    typeData += "<a href='javascript:;' alt-value='" + s + "'";
                    typeData += type == 'subject' && s == that.subjectid ? " class='item-current'>" : type == 'year' && s == that.yearid ? " class='item-current'>" : type == 'publishState' && s == that.publishid ? " class='item-current'>" : " >";
                    typeData += s == -1 ? "所有" : s;
                    typeData += "</a>";
                });
                return typeData;
            },
            getType : function(attr) {
                return _.uniq(mycourses.pluck(attr));
            },

            subjectOnly : function(e) {
                $(e.currentTarget).addClass("item-current").siblings().removeClass('item-current');
                this.subjectid = $(".courseFilter-item .subjects a.item-current").attr("alt-value");
                this.yearid = $(".courseFilter-item .grades a.item-current").attr("alt-value");
                this.publishid = $(".courseFilter-item .publishs a.item-current").attr("alt-value");

                this.redirect();
            },

            sortEvent : function(e) {
                if ($(e.currentTarget).hasClass("j_sortYear")) {
                    this.setSortUpOrDownState('year');
                } else if($(e.currentTarget).hasClass("j_sortLastListen")){
                    this.setSortUpOrDownState('lastListenTime');
                } else if ($(e.currentTarget).hasClass("j_sortLastUpdate")) {
                    this.setSortUpOrDownState('lastModifyTime');
                }

                this.redirect();
            },

            setSortUpOrDownState : function(stype) {
                if( this.sortType == stype) {
                    this.sortHistories[ this.sortType] = this.sortHistories[ this.sortType] == 'undefined' ? 'down' : this.sortHistories[ this.sortType] == 'up' ? 'down' : 'up';

                } else {
                    this.sortHistories[ this.sortType] = this.sortHistories[ this.sortType] == 'undefined' ? 'down' : this.sortHistories[ this.sortType];
                }
                this.sortUpOrDown = this.sortHistories[ this.sortType];
                this.sortType = stype;
            },
            //在视图渲染时候，初始化排序的样式
            renderSortBefore : function() {
                var that = this;
                _.each( this.sortHistories, function(value, key) {
                    if (key == 'year') {
                        if (key == that.sortType) {
                            if(that.sortHistories[key] == 'up') {
                                $(".courseSort a.j_sortYear").find("i").addClass("ui-icon-ascending-on").removeClass("ui-icon-descending-off ui-icon-ascending-off ui-icon-descending-on");
                            } else {
                                $(".courseSort a.j_sortYear").find("i").addClass("ui-icon-descending-on").removeClass("ui-icon-ascending-on ui-icon-ascending-off ui-icon-descending-off");
                            }
                        } else {
                            if(that.sortHistories[key] == 'up') {
                                $(".courseSort a.j_sortYear").find("i").addClass("ui-icon-ascending-off").removeClass("ui-icon-descending-off ui-icon-ascending-oon ui-icon-descending-on");
                            } else {
                                $(".courseSort a.j_sortYear").find("i").addClass("ui-icon-descending-off").removeClass("ui-icon-ascending-on ui-icon-ascending-off ui-icon-descending-on");
                            }
                        }
                    }

                    if (key == 'lastListenTime') {
                        if (key == that.sortType) {
                            if(that.sortHistories[key] == 'up') {
                                $(".courseSort a.j_sortLastListen").find("i").addClass("ui-icon-ascending-on").removeClass("ui-icon-descending-off ui-icon-ascending-off ui-icon-descending-on");
                            } else {
                                $(".courseSort a.j_sortLastListen").find("i").addClass("ui-icon-descending-on").removeClass("ui-icon-ascending-on ui-icon-ascending-off ui-icon-descending-off");
                            }
                        } else {
                            if(that.sortHistories[key] == 'up') {
                                $(".courseSort a.j_sortLastListen").find("i").addClass("ui-icon-ascending-off").removeClass("ui-icon-descending-off ui-icon-ascending-oon ui-icon-descending-on");
                            } else {
                                $(".courseSort a.j_sortLastListen").find("i").addClass("ui-icon-descending-off").removeClass("ui-icon-ascending-on ui-icon-ascending-off ui-icon-descending-on");
                            }
                        }
                    }

                    if (key == 'lastModifyTime') {
                        if (key == that.sortType) {
                            if(that.sortHistories[key] == 'up') {
                                $(".courseSort a.j_sortLastUpdate").find("i").addClass("ui-icon-ascending-on").removeClass("ui-icon-descending-off ui-icon-ascending-off ui-icon-descending-on");
                            } else {
                                $(".courseSort a.j_sortLastUpdate").find("i").addClass("ui-icon-descending-on").removeClass("ui-icon-ascending-on ui-icon-ascending-off ui-icon-descending-off");
                            }
                        } else {
                            if(that.sortHistories[key] == 'up') {
                                $(".courseSort a.j_sortLastUpdate").find("i").addClass("ui-icon-ascending-off").removeClass("ui-icon-descending-off ui-icon-ascending-oon ui-icon-descending-on");
                            } else {
                                $(".courseSort a.j_sortLastUpdate").find("i").addClass("ui-icon-descending-off").removeClass("ui-icon-ascending-on ui-icon-ascending-off ui-icon-descending-on");
                            }
                        }
                    }

                });

            },

            redirect : function() {
                var url = '';
                url += this.subjectid == -1 ? '' : '/sid-'+this.subjectid;
                url += this.yearid == -1 ? '' : '/yid-'+this.yearid;
                url += this.publishid == -1 ? '' : '/pid-' + this.publishid;
                url += "/sort-" + this.sortType + "-" + this.sortUpOrDown;
                location.href = baseSaleUrl + url;
            },
            renderFilter : function() {
                var that = this;
                var filtedModels = _.filter(mycourses.models, function(item) {
                    var useSubject = that.subjectid != -1 ? that.subjectid == item.get("subject") : true;
                    var useYear = that.yearid != -1 ? that.yearid == item.get("year") : true;
                    var usePublish = that.publishid != -1 ? that.publishid == item.get('publishState') : true;

                    return useSubject && useYear && usePublish;
                });

                sortModels = filtedModels.sort(function(a, b) {
                    return that.sortUpOrDown == "up" ? a.get(that.sortType) > b.get(that.sortType) : a.get(that.sortType) < b.get(that.sortType);
                });
                this.renderCourses(sortModels);
            }
        });
        new courseView();
    }

});