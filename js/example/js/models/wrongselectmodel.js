/**
 * Date: 13-4-22
 * Time: 上午11:05
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var wrongSelectModel = Backbone.Model.extend({
        defaults :{
            subject : [],
            course : [],
            lesson : [],
            section : [],
            type : "2"
        },

        parseData : function(response, options){
            var type = this.get("type");
            var subjectType = '';
            if( type == 1){
                var temp_subject = [];
                for( var i = 0; i < response.length; i++){
                    var subjectItem = response[i];
                    var subjectId = subjectItem.typeid.toString();
                    var subjectDataItem = {
                        subjecttype : subjectId,
                        subjectname : subjectItem.type,
                        count:subjectItem.count,
                        list:subjectItem.list
                    };
                    temp_subject.push(subjectDataItem);
                }
                this.set("subject", temp_subject);
            }
            if( type == 2){
                var temp_lesson = [];
                for( var i = 0; i < response.length; i++){
                    var lessonItem = response[i];
                    var lessonDataItem = {
                        courseGuid : lessonItem.lessonGuid,
                        lessonName : lessonItem.lessonName
                    };
                    temp_lesson.push(lessonDataItem);
                }
                this.set("lesson", temp_lesson);
            }
            if( type == 3){
                var temp_section = new Array();

                for( var i = 0; i < response.length; i++){
                    var sectionItem = response[i];
                    var sectionDataItem = {
                        sectionId : sectionItem.guid,
                        lessonGuid : sectionItem.lessonguid,
                        samesectiondata : sectionItem.samesectiondata,
                        sectionname : sectionItem.sectionname
                    };
                        temp_section.push(sectionDataItem);
                };
                this.set("section", temp_section);
            }
            return this;
        },

        useData : function(response, options){
            var data = response.data;
            var myType = this.get("type");
            var courseData = {};
            var courseDataItem = {};
            var subjectType = '';
            if(myType == "2"){
                this.set("subject",[]);
                this.set("course",[]);
                var temp_subject = this.get("subject");
                for(var i = 0, length = data.length; i < length; i++) {
                    var subjectData = data[i];
                    subjectType =  (subjectData.typeid).toString();

                    var subjectDataItem = {
                        subjecttype : subjectType,
                        subjectname : subjectData.type,
                        isreview : subjectData.needreviewsecsum,
                        num : subjectData.secsum
                    };

                    if (subjectData.list.count > 0) {
                        var temp_course = this.get("course");
                        for (var k in subjectData.list) {
                            if(k !== 'count'){
                                courseData = subjectData.list[k];
                                courseDataItem = {
                                    subjecttype : courseData.subjectid,
                                    courseid : courseData.guid,
                                    coursename : courseData.coursename,
                                    isreview : courseData.needreviewsum,
                                    num : courseData.sum
                                };
                               temp_course.push(courseDataItem);
                            }
                        }
                        this.set("course",temp_course);
                    }
                    temp_subject.push(subjectDataItem);
                };
                this.set("subject", temp_subject);
            };
            if(myType == "1"){
                this.set("lesson",[]);
                var temp_lesson = this.get("lesson");
                for(var i = 0, length = data.length; i < length; i++) {
                    var lessonData = {};
                    var lessonDataItem = {};
                    lessonData = data[i];
                    lessonDataItem = {
                        courseid : lessonData.salesguid,
                        lessonid : lessonData.lessonguid,
                        lessonname : lessonData.lessonname,
                        isreview : lessonData.needreviewsum,
                        num : lessonData.sectionnum
                    };

                    temp_lesson.push(lessonDataItem);
                }
                this.set("lesson", temp_lesson);
            }
            return this;
        }
    });
    return wrongSelectModel;
});