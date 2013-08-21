/**
 * 除去正式课程以外的课程列表
 * User: sihuayin
 * Date: 13-4-12
 * Time: 下午4:28
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var otherCourseCollection = require('../collections/courses');
    var otherCourseTemplate = require("../../html/othercourse.html");
    var Popup = require("../components/popup");
    var district = require("../components/districtselect");
    exports.init = function(courseType) {

        var collections = new otherCourseCollection();
        collections.url = '/api/my/courses/' + courseType;
        var otherCourseView = Backbone.View.extend({
            el : "#content",
            template : _.template(otherCourseTemplate),
            initialize : function () {
                this.listenTo(collections, "reset", this.render);
                collections.fetch({reset : true});
            },
            provinceChangeHander : function() {
                //this._clear_classname_display();
            },

            districtChangeHander : function() {
                //this._clear_classname_display();
            },

            subDistrictChangeHandler : function() {
                //this._clear_classname_display();
            },

            _clear_classname_display : function() {
            //if (this) {
            //    this.classObj.style.display = "none";
            //}
            },
            _get_classname : function(schoolName, $schoolDom) {
                if (schoolName == '') {
                    return ;
                }
                district.getSchoolName(schoolName);
                var data = {
                    grade: this.gradeObj.options[this.gradeObj.selectedIndex].value,
                    school: school_value,
                    callbackFunc: self._get_classname_callback
                };
                if (data.school != "")
                    et.user.utility.getClassName(data);
            },

            _grade_change_handle : function(is_teacher) {
                if (is_teacher) {
                    if (user_data.updated != 1) {
                        district.refreshSchools();
                    }
                    return;
                }

                var grade_value = $("#igrade").val();
                var classifDisplayObj = $("#iclassname");
                if (grade_value == '高一' || grade_value == '初三' || grade_value == '初二' || grade_value == '初一') {
                    classifDisplayObj.css("display","none");
                    $("#classify_area").css("display", "none");
                } else {
                    classifDisplayObj.css("display", "block");
                    $("#classify_area").css("display","block");
                }

                if (user_data.updated != 1)
                    district.refreshSchools();

                var school_value = $("#ischool").val();
                this._get_classname(school_value);
            },

            _studentChangeHandle : function(e) {
                e.data._grade_change_handle(0);
            },

            _teacherChangeHandle : function () {
                this._grade_change_handle(1);
            },

            render : function() {
                var that = this;
                this.data = {};
                this.data.courseType = courseType.substr(0, courseType.length-1);
                this.data.courses = collections.toJSON();
                this.data.userData = user_data; //全局变量,用户信息
                this.data.classNameData = this.getClassNamses("/" + user_data.school + "/" + user_data.gradeName); //全局变量 班级信息
                this.$el.html(this.template(this.data));

                if (courseType == 'direct/') {
                        t1 = new Popup({trigger:".js_direct_window",popupBlk:".pop_new_p",closeBtn:".popclose2 a",eventType:"click",useOverlay:true,isCentered:true,isDrag:true,onAfterPop : function() {
                            district.init([
                                {selectId : 'iprovince',alertItem : { "value": "", "text": "请选择省份名" },changeFn : that.provinceChangeHander,defaultValue : user_data.province},
                                {selectId : 'idistrict',alertItem : { "value": "", "text": "请选择shi份名" },changeFn : that.districtChangeHander,defaultValue : user_data.district},
                                {selectId : 'isubdistrict',alertItem : { "value": "", "text": "请选择xian份名" },changeFn : that.districtChangeHander,defaultValue : user_data.subDistrict},
                                {selectId : 'ischool',alertItem : { "value": "", "text": "请选择xuexiao" },changeFn : that.districtChangeHander,defaultValue : user_data.school}
                            ], "districtname","igrade");
                        }});


                    $("#igrade").on("change", "", this, this._studentChangeHandle);
                    $(".popsub a.pop_subbtn").on("click", "", this, this.submitDirect);
                }
            },

            submitCallBack : function() {
                var url = "#/courses/direct/";
                location.reload(true);
            },
            submitDirect : function (e) {
                var provinceName = $("#iprovince").val();
                if(provinceName == ""){
                    alert("请选择省份信息");
                    return;
                }

                var districtName = $("#idistrict").val();
                if(districtName == ""){
                    alert("请选择市信息");
                    return;
                }

                var subdistrictName = $("#isubdistrict").val();
                if(subdistrictName == ""){
                    alert("请选择地区/县信息");
                    return;
                }

                var schoolName = $("#ischool").val();
                if(schoolName == ""){
                    alert("请选择学校信息");
                    return;
                }

                var gradeName = $("#igrade").val();
                if(gradeName == ""){
                    alert("请选择年级");
                    return;
                }
                var contact_no = $("#id_mobilePhone").val().replace(/(\s)+/g, "");
                var mobile = "";
                var telephone = "";
                if(contact_no == ""){
                    alert("请填写您的联系方式");
                    return;
                }
                if(e.data.checkmobilePhone(contact_no) == 1){
                    mobile = contact_no;
                }
                else if(e.data.checkTelPhone(contact_no) == 1){
                    telephone = contact_no;
                }
                else {
                    alert("联系方式格式不正确");
                    return;
                }
                district.submit(e.data.submitCallBack,{telephone:telephone, mobile: mobile});
            },


            checkmobilePhone : function(sMobilePhone) {
                var pattern = /^1[3458]\d{9}$/;
                if(pattern.exec(sMobilePhone)) {
                    return 1;
                } else {
                    return -1;
                }
            },

            checkTelPhone : function(sTelPhone) {
                var pattern = /^0\d{2,3}-\d{7,8}$/;
                if(pattern.exec(sTelPhone)) {
                    return 1;
                } else {
                    return -1;
                }
            },

            getClassNamses : function(data) {
                var result = null;
                $.ajax({
                    async: false,
                    type: "GET",
                    url: '/api/my/info/classes'.concat(data) ,
                    contentType: "charset=utf-8",
                    data: "",
                    dataType : "json",
                    success: function (json, type, http) {
                        result = json;
                    },
                    error : function() {
                        result = [];
                    }
                });
                return result;
            }
    });

        return new otherCourseView;
    }
});