/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-3-29
 * Time: 上午10:03
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Listen = require("../components/listen");
    var listenObj = new Listen();
    var Backbone = require('backbone');
    var section = require('../views/sectionview');
    var courseInfoTemplate = require("../../html/lesson.html");
    var lessonItemTemplate = require("../../html/lessonitem.html");
    var windowPop = require("../components/popup.js");

    exports.init = function(courseType, cid) {

        var courseInfoModel = Backbone.Model.extend({
            defaluts : {
                id : 0,
                name : 'defalut ..',
                courseType : 'formal',
                lessons : []
            },
            url : '/api/my/lessons/' + courseType + "/" + cid + "/"
        });

        var courseInfo = new courseInfoModel();

        var lessonInfoModel = Backbone.Model.extend({
            defaults : {
                name : 'NO name .',
                isPublic : 1
            },
            initialize : function() {
                var d=new Date();
                var day=d.getDate();
                var month=d.getMonth() + 1;
                var year=d.getFullYear();
                var currentTime = year + "-" + month + "-" + day;
                if (this.get("publishTime") > currentTime) {
                    this.set("isPublic", 0);
                } else {
                    this.set("isPublic", 1);
                }
            }


        });

        var lessonCollection = Backbone.Collection.extend({
            model : lessonInfoModel

        });

        var courseInfoView = Backbone.View.extend({
            el : '#content',
            template : _.template(courseInfoTemplate),

            initialize : function() {
                this.listenTo(courseInfo, 'change', this.render);
                this.lessonData = [];
                this.lessons = null;
                courseInfo.fetch();

               // $("").on("click", this.toggleSections);
            },

            getType : function (course_type) {
                switch (course_type) {
                    case "free":
                        return 0;
                    case "studycardcourse":
                        return 3;
                    case "direct":
                        return 4;
                    case "personality":
                        return 6;
                    case "experience":
                        return 2;
                    case "formal":
                        return 1;
                    case "easycash":
                        return 5;
                }
            },


            playLesson : function(e) {

            },

            render : function() {
                courseInfo.set("courseType", courseType);
                courseInfo.set("isIe", listenObj.isIe());
                this.lessonData = courseInfo.get('lessons');
                this.lessons = new lessonCollection(this.lessonData );
                var lType = this.getType(courseType);
                this.$el.html(this.template(courseInfo.toJSON()));
                _.each(this.lessons.models, function(item) {
                    item.set("courseGuid", courseInfo.get("id"));
                    item.set("courseRealGuid", courseInfo.get("realGuid"));
                    item.set("atype", lType);
                    $(".lesson-list").append(_.template(lessonItemTemplate, item.toJSON()));
                });
                $(".j_slideSectionTrigger").on("click", '', this, this.toggleSections);
                var pop = new windowPop({
                    trigger:".j_playLesson",
                    popupBlk:"#J_downloadPop",
                    closeBtn:".j_downloadPopClose a",
                    eventType:"click",
                    useOverlay:true,
                    isCentered:true,
                    isDrag:true,
                    onAfterPop : function(c, e){
                        var canListen = listenObj.isInstallActiveX() < 0 ? false : true;
                        if (canListen) {
                            var courseid = $(e.currentTarget).attr("course_guid");
                            var realGuid = $(e.currentTarget).attr('course_real_guid');
                            var lessonid = $(e.currentTarget).attr('lesson');
                            listenObj.listenLesson(user_data.userName, courseid, realGuid, lessonid, 1, lType);
                            this.close();
                        }

                    }
                });
            },

            toggleSections : function(e) {
                var lid = $(e.currentTarget).attr("lid");

                var sectionData = [];
                _.each(courseInfo.get('lessons'), function(item) {
                    if (item.id == lid) {
                        var sectionsModel = new Backbone.Model({});
                        sectionsModel.url = "/api/my/sections/" + lid + "/";
                        sectionsModel.fetch({wait: true,success : function(model, res) {
                            _.each(res, function(smodel) {
                                _.each(item.catalog, function(cat, ind) {
                                    if (cat.children == null && cat.id == smodel.id) {
                                        item.catalog[ind].path = smodel.path;
                                        item.catalog[ind].samesectiondata = smodel.samesectiondata;
                                    } else if (cat.children) {
                                        _.each(cat.children, function(c, cind) {
                                            if (c.id == smodel.id) {
                                                item.catalog[ind].children[cind].path = smodel.path;
                                                item.catalog[ind].children[cind].samesectiondata = smodel.samesectiondata;
                                            }
                                        })
                                    }
                                })
                            });
                            sectionData = item.catalog;
                            section.show($(e.currentTarget), sectionData, courseInfo.get("id"), courseType);
                        }});

                    }
                });

            }
        });



        return new courseInfoView();
    };

});