/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-6-24
 * Time: 下午5:12
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var validCode = require("../components/validcode");
    var templates = require("../../html/active.html");
    var clientcontrol = require("../components/clientcontrol");
    var secondView = require("./activesecondview");

    var activeView = Backbone.View.extend({
        el: "#content",
        events : {
            "click #J_submitActive" : "submitActiveCode"
        },

        template : _.template(templates),
        initialize : function() {
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            validCode.init("J_validCodeImg", "validCode", "J_validCodeValue");
            validCode.load();
        },
        submitActiveCode : function () {
            var sCode = $("#J_activeCode").val().replace(/(\s)+/, "");
            var inputVerifyCode = $("#validCode").val().replace(/^(\s)+/, "");

            var objCodeValue = $("#J_validCodeValue");
            var verifyValue = objCodeValue.val();
            if(sCode == "")
            {
                alert("请输入激活密码!!!");
                return;
            }
            sCode = validCode.filterInput(sCode);
            if(!validCode.checkNums(sCode)){
                alert("请输入正确格式的激活密码（全部是数字）!!!");
                return;
            }
            if(inputVerifyCode == ""){
                alert("请输入校验码!!!");
                return;
            }
            inputVerifyCode = validCode.filterInput(inputVerifyCode);
            if(!validCode.checkNums(inputVerifyCode)){
                alert("请输入正确格式的验证码（全部是数字）!!!");
                return;
            }
            $("#J_activeLoading").css("display", "block")
            $("#J_submitActive").css("display", "none");

            var client_info_obj = new clientcontrol();
            var client_pc_type = client_info_obj.get_client_pc_type();
            var client_pc_harddevice = client_info_obj.get_client_harddevice();

            validCode.checkActiveCode(sCode, inputVerifyCode, verifyValue, client_pc_type,client_pc_harddevice, this.checkActiveCodeCallBack);
            return false;
        },
        checkActiveCodeCallBack : function (responseText) {
            var response = JSON.parse(responseText);
            if(response.success) {
                if(response.end){
                    alert("课程已激活，请进入下载页面点击“下载简单课堂”按钮下载听课软件开始听课");
                    et.software.utility.startSoftware();
                }
                else{
                    var scode =  $("#J_activeCode").val().replace(/(\s)+/, "");
                    secondView.init(scode);
                }

            } else {
                if(response.failDesc != undefined) {
                    alert(response.failDesc);
                }
                else {
                    if(response.failNo != undefined && response.failNo == 0){
                        alert("对不起，此卡只能用于方正品牌电脑上激活。");
                        window.location.href = baseUrl + "/software/founder/";
                    }
                    else
                        alert("激活失败");
                }
            }
            $("#J_activeLoading").css("display", "none");
            $("#J_submitActive").css("display", "block");
            validCode.load();
        },
        remove: function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }


});

    return activeView;
});