/**
 * Date: 13-4-22
 * Time: 上午11:05
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var homeworkModel = Backbone.Model.extend({
        defaults :{
            subjects : [],
            courses : []
        },
        parse : function(response, options){
            var that = this;
            var temp_subject = [];
            this.set("courses", []);
            _.each(response,function(courseItem){

                var subjectDataItem = {
                    id : courseItem.typeid,
                    type : courseItem.type,
                    list : courseItem.list,
                    count : courseItem.count
                };

                if (courseItem.count > 0) {
                    var temp_course = that.get("courses");
                    for (var k in courseItem.list) {
                            courseData = courseItem.list[k];
                            courseDataItem = {
                                id : courseItem.typeid,
                                authtype : courseData.authtype,
                                coursename : courseData.coursename,
                                guid : courseData.guid,
                                realguid : courseData.realguid
                            };
                            temp_course.push(courseDataItem);
                    }
                    that.set("courses",temp_course);
                }
                temp_subject.push(subjectDataItem);
            });
            that.set("subjects", temp_subject)
        }
    });
    return homeworkModel;
});