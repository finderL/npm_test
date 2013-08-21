/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-7-3
 * Time: 下午2:53
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var validCode = require("../components/validcode");
    var templates = require("../../html/personalitylesson.html");

    var PersonalView = Backbone.View.extend({
        el : "#content",
        events : {
            "click #J_personalActive" : "submitPersonal"
        },
        template :_.template(templates),
        initialize : function () {
            this.render();
        },

        render : function () {
            this.$el.html(this.template());
            validCode.init("J_validCodeImg", "validCode", "J_validCodeValue");
            validCode.load();
        },

        submitPersonal : function () {
            var sCode = $("#mobile").val().replace(/(\s)+/, "");
            var inputVerifyCode = $("#validCode").val().replace(/^(\s)+/, "");

            var verifyValue = $("#J_validCodeValue").val();
            if(sCode == "") {
                alert("请输入收到的激活码!!!");
                return;
            }
            sCode = validCode.filterInput(sCode);

            if(!validCode.checkNums(sCode) ){
                alert("请输入正确格式的激活码!!!");
                return;
            }
            if(inputVerifyCode == "") {
                alert("请输入校验码!!!");
                return;
            }
            inputVerifyCode = validCode.filterInput(inputVerifyCode);
            if(!validCode.checkNums(inputVerifyCode)){
                alert("请输入正确格式的验证码（全部是数字）!!!");
                return;
            }
            var processing = $("#id_loading");
            processing.css("display", "block");
            var submitObj = $("#subarea");
            submitObj.css("display", "none");

            this.activeLesson(sCode, inputVerifyCode, verifyValue, this.checkActiveCodeCallBack);
        },

        checkActiveCodeCallBack : function (response) {
            if(response.success) {
                alert("激活成功!");
                window.location.href = baseUrl + "/studycenter/#/courses/personality/";
            } else {
                if(response.failDesc != undefined){
                    alert(response.failDesc);
                } else {
                    if(response.failNo != undefined && response.failNo == 0){
                        alert("对不起，该激活密码还需要安装方正检测控件才能激活");
                        window.location.href = baseUrl + "/software/founder/";
                    } else {
                        alert("激活失败");
                    }
                }
            }
            var processing = $("#id_loading");
            processing.css("display", "none");
            var submitObj = $("#subarea");
            submitObj.css("display", "block");
            validCode.load();
        },


        activeLesson : function (sCode, inputVerifyCode, verifyValue, checkActiveCodeCallBack) {
            var url = baseUrl + "/api/my/active/personal/";
            var method = "post";
            var data = "do=personalitylesson&code=" + sCode + "&vc=" + inputVerifyCode + "&vk=" + verifyValue;

            $.ajax({
                url : url,
                type : method,
                data : data,
                dataType : "json",
                success : function (response) {
                    checkActiveCodeCallBack(response);
                }
            });
        },

        remove  : function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }

    });

    return PersonalView;
});