/**
 * Date: 13-6-24
 * Time: 下午2:45
 */
define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var viewTemplates = require("../../html/userphoto.html");
    $.flash = require("../../../js/libs/jquery.flash");
    var mylogoModel = require("../models/mylogomodel");

    var userPhotoView = Backbone.View.extend({
        el : "#content",
        template : _.template(viewTemplates),
        events : {

        },

        initialize : function() {
            this.myLogo = new mylogoModel();
            this.listenTo(this.myLogo, "change", this.render);
            this.myLogo.fetch();
        },

        render : function() {
            this.$el.html(this.template());

            var userFigure = this.myLogo.get("user_figure");
            var logoInfo = this.myLogo.get("logo_info");
            if (!logoInfo) {
                logoInfo = userFigure == 1 ? "/images/qa/tec_photo.png" : "/images/qa/stu_photo.png";
            }

            var self = this;
            var callbackName = "_et_logo_callback" + Math.floor(100);
            window[callbackName] = function (action, result) {
                return self.flashCallBack(action, result);
            };

            $('#mylogo').flash(
                {
                    src: '/js/ethead.swf?v=20120724',
                    width: 700,
                    height: 600,
                    allowscriptaccess: "always",
                    wmode: "transparent",
                    flashvars:
                    {
                        loadUrl: logoInfo,
                        uploadUrl: '/upload/',
                        jsfunc: callbackName,
                        maxSize: 5242880
                    }
                },
                { version: '10' }
            );
        },

        flashCallBack : function(action, result) {
            if (action == "upload") {
                if (result.success) {
                    this.updateUserFace();
                }
                else {
                    alert("上传头像失败");
                    window.location.reload(true);
                }
            }
            else if (action == "upload_error") {
                alert("上传头像失败");
                window.location.reload(true);
            }
            else if (action == "size_limit") {
                alert("文件太大，请您重选");
            }
            else if (action == "format_limit") {
                alert("文件格式不对，请您重选");
            }
        },

        updateUserFace : function() {
            $.ajax("/api/my/userinfo/setuserface/", {
                type: 'POST',
                dataType: 'json',
                data: { 'do': 'suf' },
                success: function (result) {
                    if (result.success) {
                        alert("修改成功");
                    }
                    else {
                        alert(result.failDesc);
                    }
                    window.location.reload(true);
                },
                error: function () {}
            });
        }
    });

    return userPhotoView;
});
