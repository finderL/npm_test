/**
 * Date: 13-6-24
 * Time: 上午11:33
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var viewTemplates = require("../../html/userpassword.html");

    var userPassWordView = Backbone.View.extend({
        el : "#content",
        template : _.template(viewTemplates),
        events : {

        },

        initialize : function() {
            this.render();
        },

        render : function() {
            var that = this;
            this.$el.html(this.template());
            $('.userinfo-save a').on('click', '', this, this.submit);
        },

        submit : function(e) {

            var sOldPwd = $('#oldpwd').val().replace(/(\s)+/g, "");
            var sNewPwd = $('#newpwd').val().replace(/(\s)+/g, "");
            var sAgainPwd = $('#againpwd').val().replace(/(\s)+/g, "");
            var result = e.data._checkpassword_by_style("#newpwd");
            var result2 = e.data._checkpassword_by_style("#againpwd");
            if (result == 1) {
                alert ("新密码不能含有空格，请重新输入");
                $('#newpwd').val('').focus();
                return;
            }
            if(result2==1){
                alert ("重复密码不能含有空格，请重新输入");
                $('#againpwd').val('').focus();
                return;
            }
            if(sNewPwd.length<5){
                alert ("密码长度不能小于5位，请重新输入");
                $('#newpwd').val('').focus();
                return;
            }
            if(sNewPwd.length>20){
                alert ("密码长度不能大于20位，请重新输入");
                $('#newpwd').val('').focus();
                return;
            }
            if(sNewPwd != sAgainPwd)
            {
                alert("两次密码前后不一致，请重新输入!!!");
                $('#againpwd').val('').focus();
                return;
            }
            if(sNewPwd == ""){
                alert("新密码不能为空");
                $('#newpwd').focus();
                return;

            }
            if(sOldPwd==""){
                alert ("原密码不能为空");
                $('#oldpwd').focus();
                return;
            }
            if(sNewPwd.charAt(0)== "*")
            {
                alert("密码不能以*开始");
                $('#newpwd').val('').focus();
                return
            }

            $.ajax({type:'PUT',
                    url:'/api/my/userinfo/modifyuserpwd/',
                    data:'oldpwd=' + sOldPwd + '&newpwd=' + sNewPwd,
                    datatype:'json',
                    success:function(data){
                        alert('密码修改成功');
                        $('#oldpwd').val('');
                        $('#newpwd').val('');
                        $('#againpwd').val('');
                    },
                    error : function(data) {
                        if(data.responseText > '') {
                            var errorText = JSON.parse(data.responseText);
                            alert(errorText.error);
                            $('#oldpwd').val('').focus();
                        }
                        else
                            alert('密码修改失败');
                    }
               });

        },


        _checkpassword_by_style : function(item) {
            var passwordold = $(item).val();
            var pattern=/(\s)+/g;
            if(pattern.test(passwordold)){
                return 1;
            }else{
                return -1;
            }
        }

});

    return userPassWordView;
});
