/**
 * Date: 13-6-24
 * Time: 下午4:04
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var viewTemplates = require("../../html/onlinepayment.html");
    var utility = require("../components/utility")

    var onlinePaymentView = Backbone.View.extend({
        el : "#content",
        template : _.template(viewTemplates),

        initialize : function() {
            this.render();
        },

        render : function() {
            var that = this;
            this.$el.html(this.template());

            $("#iremark").css("color","#888")
              .focus(function(){
                $(this).css("color","#222");
                if($(this).val() == this.defaultValue){
                    $(this).val("");
                }
            }).blur(function(){
                    if($(this).val() == ''){
                        $(this).css("color","#888");
                        $(this).val(this.defaultValue);
                    }
            });

            $('.userinfo-save a').on('click', '', this, this.paymentSubmit);
        },

        paymentSubmit : function() {
            var paymentAmount = $("#ipaymentamount").val();
            var remark = $("#iremark").val();

            if(paymentAmount == ""){
                alert("请输入支付金额");
                return false;
            }

            if(!utility.checkFloats(paymentAmount) || Number(paymentAmount) == 0){
                alert("请输入正确的数字或小数点格式");
                return false;
            }
            if(remark.length > 128){
                alert("输入的备注信息长度超过128个字，请删除部分备注信息");
                return false;
            }

            $.ajax({type:'POST',
                url:'/api/my/pay/',
                data:'amount=' + paymentAmount + '&remark=' + remark + '&type=0',
                datatype:'json',
                success:function(data){
                    jsonData = JSON.parse(data);
                    if(jsonData.success) {
                        window.location.href = "/pay/selectbank/";
                    } else {
                        if(jsonData.failDesc != undefined) {
                            alert(jsonData.failDesc);
                        } else {
                            alert("无法进入支付界面！");
                        }

                    }
                },
                error : function(data) {
                    if(data.responseText > '') {
                        var errorText = JSON.parse(data.responseText);
                        alert(errorText.error);
                        $('#oldpwd').val('').focus();
                    }
                    else
                        alert('无法进入支付界面!');
                }
            });
        }

    });

    return onlinePaymentView;
});
