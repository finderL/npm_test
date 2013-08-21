/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-6-26
 * Time: 下午2:29
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var templates = require("../../html/activestep2.html");
    var product = require("../components/productutility");
    var toggle_tab = require("../components/toggle_tab");
    exports.init = function(cardId) {
        var activeModel = new Backbone.Model();
        activeModel.url = baseUrl + "/api/my/active/";
        activeModel.fetch({data:{"s" : 2} });
        var secondView = Backbone.View.extend({
            el: "#content",
            events : {
                "click .J_submit" : "submit",
                "click .J_cancel" : "cancel",
                "click #J_courseInfo td input" : "refreshSelectedCourse"
            },

            template :_.template(templates),
            initialize : function () {
                this.bProcessing = false;
                this.selectCourseData = [];
                this.listenTo(activeModel, "change", this.render);
            },

            render : function () {
                if (!activeModel.get("success")) {
                    alert(activeModel.get("failDesc"));
                    return false;
                }
                var courses = activeModel.get("data");
                var renderCourses = {};
                if (courses.buy.length > 0) {
                    _.each(courses.buy, function(buy) {
                        var grades = buy.grades.split(",");
                        _.each(grades, function(grade) {
                            if (!_.has(renderCourses, grade)) {
                                renderCourses[grade] = [];

                            }
                            buy.isBonus = 0;
                            if (_.indexOf(renderCourses, buy) < 0) {
                                renderCourses[grade].push(buy);

                            }
                        });
                    });
                }

                if (courses.bonus.length > 0) {
                    _.each(courses.bonus, function(bonus) {
                        if (bonus.data.length > 0) {
                            _.each(bonus.data, function (bonusData) {
                                var grades = bonusData.grades.split(",");
                                _.each(grades, function(grade) {
                                    if (!_.has(renderCourses, grade)) {
                                        renderCourses[grade] = [];

                                    }
                                    bonusData.isBonus = 1;
                                    if (_.indexOf(renderCourses, bonusData) < 0) {
                                        renderCourses[grade].push(bonusData);

                                    }

                                });
                            })
                        }
                    })
                }
                var data = {courses: renderCourses, isStudy: activeModel.get("card_type") == 'studycard' ? 1 : 0}
                this.$el.html(this.template({data : data}));
                toggle_tab.init({tabName:"#J_gradeTab li", noContent:false, currentName:".ui-tab-item-current", eventType:"click"});
            },

            cancel : function(response) {
                product.cancelbuyProc(function(json) {
                    if (json.success) {
                        window.location.href = baseUrl + "/studycenter#/active/";
                    } else {
                        window.location.href = baseUrl;
                    }
                });
            },

            submit : function () {
                if(this.bProcessing){
                    alert("正在处理，请不要重复提交");
                    return;
                }
                var course_data = activeModel.get("data");
                var encodeCourse = "[";
                for(var i = 0; i < course_data.bonus.length; i ++){
                    var selectItem = course_data.bonus[i].data;

                    encodeCourse += "[";
                    for(var j = 0;  j < selectItem.length; j ++){
                        encodeCourse += "\""+ selectItem[j].guid+"\"";
                        if (j != selectItem.length - 1)
                            encodeCourse += ",";
                        else
                            encodeCourse += "]";
                    }
                    if(i != course_data.bonus.length -1) encodeCourse += ",";
                }
                encodeCourse +="]";
                this.bProcessing = true;
                $("#id_loading").css("display", "block");
                product.buyProc(encodeCourse, this.buyProcallBack);

            },

            buyProcallBack : function (response){
                if(!response.success){
                    if(response.failDesc)
                        alert(response.failDesc);
                    else
                        alert("内部错误，请稍候重试");
                } else {
                    if (response.failDesc) {
                        if(response.goto) {
                            alert("部分课程激活成功，请选择课程模块");
                            window.location.href = baseUrl + "/studycenter#/activemodule";
                        } else {
                            alert("部分课程激活成功激活成功!");
                            window.location.href = baseUrl + "/studycenter#/courses/formal";
                        }
                    } else {
                        if (response.goto) {
                            alert("激活成功，请选择课程模块");
                            window.location.href = baseUrl + "/studycenter#/activemodule";
                        } else {
                            alert("激活成功!");
                            window.location.href = baseUrl + "/studycenter#/courses/formal";
                        }
                    }
                }
                this.bProcessing = false;
                $("#id_loading").css("display", "none");
            }

        });
        return new secondView;
    }

});