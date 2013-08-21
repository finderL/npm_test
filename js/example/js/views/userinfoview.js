/**
 * Date: 13-6-24
 * Time: 上午11:08
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var viewTemplates = require("../../html/userinfo.html");
    var userinfoModel = require("../models/userinfomodel");
    var district = require("../components/districtselect");
    var utility = require("../components/utility");

    var userInfoView = Backbone.View.extend({
        el : "#content",
        template : _.template(viewTemplates),
        events : {
            "click #help_mail_report"  :  "showTips",
            "click #tips_mail_report span.close"  :  "hideTips"
        },

        showTips : function(){
            $("#tips_mail_report").show();
        },

        hideTips : function(){
            $("#tips_mail_report").hide();
        },

        initialize : function() {
            this.myUserinfo = new userinfoModel();
            this.listenTo(this.myUserinfo, 'change', this.render);
            this.myUserinfo.fetch();
        },

        render : function() {
            var that = this;
            this.$el.html(_.template(viewTemplates, this.myUserinfo.toJSON()));

            this.user_data = this.myUserinfo.get('userInfo');
            this.displayUserinfo(this.user_data);
            $('.userinfo-save a').on('click', '', this, this.submit);
        },

        displayUserinfo : function(user_data) {
            district.init([
                {selectId : 'iprovince',alertItem : { "value": "", "text": "请选择省份名" },changeFn : function(){},defaultValue : user_data.province},
                {selectId : 'idistrict',alertItem : { "value": "", "text": "请选择城市名" },changeFn : function(){},defaultValue : user_data.district},
                {selectId : 'isubdistrict',alertItem : { "value": "", "text": "请选择区县名" },changeFn : function(){},defaultValue : user_data.subdistrict},
                {selectId : 'ischool',alertItem : { "value": "", "text": "请选择学校" },changeFn : function(){},defaultValue : user_data.school}
            ], "districtname","igrade");

            $('#UserName').val(user_data.realname);
            $('#UserMobile').val(user_data.mobile);
            $('#UserTelepho').val(user_data.telephone);
            $('#UserQQ').val(user_data.qq);
            $('#easyCash').val(user_data.easycash);
            $('#nickName').val(user_data.nickname);
            $('#studyRecordEmail').val(user_data.studyrecordemail);
            $('#igrade').val(user_data.grade);
            if(user_data.figure != 0)
                $('#isubject').val(user_data.subject);

            if(user_data.updated == 1) { //表示用户已经更改过学校信息
                $('#iprovince').attr('disabled', true);
                $('#idistrict').attr('disabled', true);
                $('#isubdistrict').attr('disabled', true);
                $('#ischool').attr('disabled', true);
                if(user_data.figure == 0)
                    $('#igrade').attr('disabled', true);
                else {
                    $('#igrade').attr('disabled', true);
                    $('#isubject').attr('disabled', true);
                }
            }
        },

        submit : function(e) {
            if(e.data.checkUserinfo()) {
                $.ajax({type:'PUT',
                    url:'/api/my/userinfo/updateuserinfo/',
                    data: e.data.updateUserInfoUrlParam,
                    datatype:'json',
                    success:function(data){
                        alert("保存成功");
                        location.reload(true);
                    },
                    error : function(data) {
                        alert('保存失败');
                    }
                });
            }
        },

        checkUserinfo : function() {
            sUserName = $("#UserName").val().replace(/(\s)+/g, "");
            updateUserInfoUrlParam = "";
            if(sUserName == "")
            {
                alert("请填写您的姓名!!!");
                return false;
            }
            else if(!utility.checkChina(sUserName))
            {
                alert("请输入中文名字!!!");
                return false;
            }
            updateUserInfoUrlParam += "rn=" + sUserName;
            sMobile = $("#UserMobile").val().replace(/(\s)+/g, "");
            sTel = $("#UserTelepho").val().replace(/(\s)+/g, "");
            sTel=sTel.replace("-","");
            if(!utility.checkMobilePhone(sMobile) && !utility.checkTelephone(sTel))
            {
                alert("您没有填写联系方式或者联系方式填写有误!!!");
                return false;
            }
            updateUserInfoUrlParam += "&mb=" + sMobile;
            updateUserInfoUrlParam += "&tl=" + sTel;
            sQQNo = $("#UserQQ").val().replace(/(\s)+/g, "");
            if(sQQNo != "" && !utility.checkNums(sQQNo)){
                alert("请填写正确的QQ号!!!");
                return false;
            }
            updateUserInfoUrlParam += "&qq=" + sQQNo;

            var studyRecordEmail = $("#studyRecordEmail").val().replace(/(\s)+/g, "");
            if(studyRecordEmail != "" && !utility.checkEmailValid(studyRecordEmail)){
                alert("您填写的接收学习报告的邮箱格式不正确");
                return false;
            }
            updateUserInfoUrlParam += "&sre=" + studyRecordEmail;

            sCity = $("#idistrict").val();
            if(sCity == "")
            {
                alert("请填写您所在的地区或者城名!!!");
                return false;
            }
            updateUserInfoUrlParam += "&dn=" + sCity;
            sSchool = $("#ischool").val();
            if(sSchool == "")
            {
                alert("请填写您所在的学校名称!!!");
                return false;
            }
            updateUserInfoUrlParam += "&sn=" + sSchool;
            if(this.user_data.figure == 0){
                sGrade = $("#igrade").val();
                if(sGrade == "")
                {
                    alert("请填写您所在的年级!!!");
                    return false;
                }
                updateUserInfoUrlParam += "&gd=" + sGrade;
            }
            else{
                sGrade = $("#igrade").val();
                if(sGrade == "")
                {
                    alert("请填写您所在的年级!!!");
                    return false;
                }
                sSubject = $("#isubject").val();
                updateUserInfoUrlParam +="&gd=" + sGrade + "&sb=" + sSubject;
            }
            var sProvinceName = $("#iprovince").val();
            updateUserInfoUrlParam += "&pn=" + sProvinceName;
            var sSubDistrictName = $("#isubdistrict").val();
            updateUserInfoUrlParam += "&sdn=" + sSubDistrictName;
            var sNickName = $("#nickName").val().replace(/(\s)+/g, "");
            updateUserInfoUrlParam += "&nk=" + sNickName;

            this.updateUserInfoUrlParam = updateUserInfoUrlParam;
            return true;

        }


    });

    return userInfoView;
});
