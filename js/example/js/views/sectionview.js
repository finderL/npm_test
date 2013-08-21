/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-3-29
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var sectionCollection = require('../collections/sectioncollection');
    var sectionTemplate = require("../../html/sectionitem.html");
    var PopupLayer = require("../components/popup");

    exports.show = function ($dom, sectionData, courseid, courseType) {
        var canListenSection = courseType == 'free' || courseType == 'formal' ? 1 : 0;
        var pview = null;
        var sectionView = Backbone.View.extend({
            tagName : 'ul',
            className : 'section-list j_slideSectionCon',
            initialize : function () {
                this.collection = new sectionCollection(sectionData);
                this.render();
            },
            render : function () {
                var that = this;
                _.each(this.collection.models, function (item) {
                    item.set("courseGuid", courseid);
                    item.set("canListenSection", canListenSection);
                    var tem = _.template(sectionTemplate);
                    that.$el.append(tem(item.toJSON()));
                });

            }
        });

        var goPractice = function(sid, myid, popWindow) {

            require.async("../views/practiceview", function(practiceView) {
                pview = new practiceView();
                pview.renderDom(".j_exercisePopDel",sid, myid);
                pview.setThisToClose(popWindow);
            });
        }
        var section = new sectionView;

        var changeSectionTitle = function(sid) {
            $(".section-action a").attr("sameids","");
            _.each(sectionData, function(sec) {
                if (sid && sec.id == sid && !sec.children) {
                    if (!sec.samesectiondata) {
                        $(".ui-icon-exercise-white").remove();
                    }
                    $(".section-theme img").attr("src",imageUrl + sec.path);
                    $(".section-action a").attr("sameids",sec.samesectiondata);
                } else if (sid && sec.children) {
                    _.each(sec.children, function(s) {
                        if (s.id == sid) {
                            if (!s.samesectiondata) {
                                $(".ui-icon-exercise-white").remove();
                            }
                            $(".section-theme img").attr("src",imageUrl + s.path);
                            $(".section-action a").attr("sameids",s.samesectiondata);
                        }
                    })
                }
            })
        }
        if (tempPop) {
            tempPop.close();
            tempPop = null;
        }
        if($dom.siblings().first().hasClass("j_slideSectionCon")) {
            $dom.siblings(".j_slideSectionCon").remove();
            $dom.removeClass("lesson-list-item-current");
        } else {
            section.$el.insertAfter($dom);
            $dom.addClass("lesson-list-item-current");

            tempPop = new PopupLayer({
                trigger: ".j_reviewPopTrigger",
                popupBlk: "#J_popSection",
                closeBtn: "#J_popClose",
                eventType : "click",
                onAfterPop : function(a, e) {
                    var myid = $(e.currentTarget).attr("sid");
                    changeSectionTitle(myid);
                    var t2 = new PopupLayer({trigger:".j_listenDoExercise",
                        popupBlk:"#J_exercisePop",
                        closeBtn:".j_exercisePopClose a",
                        eventType:"click",
                        useOverlay:true,
                        isCentered:true,
                        isDrag:true,
                        onAfterPop : function(c, e){
                            var sid = $(e.currentTarget).attr("sameids");
                            if(!sid ||  !myid) {

                                c.currentTarget.close();alert("没有练习");
                                return ;
                            }
                            goPractice(sid, myid, this);
                        },
                        onCloseCallBack : function() {
                            if (pview) {
                                pview.stop();
                           }

                        }
                    })
                }
            });
        }

    }
});