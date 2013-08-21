/**
 * CAPTCHA 图片显示
 * User: sihuayin
 * Date: 13-6-24
 * Time: 上午11:10
 * 防止用户或者程序无限制的使用
 */

define(function(require, exports, module) {
    var $ = require("jquery");
    var JSON = require("json");
    var etWebSiteUrl = baseUrl;
    module.exports = {
        serviceUrl : etWebSiteUrl + "/service/validcode/",
        showUrl : etWebSiteUrl + "/validcode/show/",
        activeUrl : etWebSiteUrl + "/service/active/",
        init : function(imageItemId, inputItemId, codeItemId) {
            var that = this;
            this.imageItemId = $("#" + imageItemId);
            this.inputItemId = $("#" + inputItemId);
            this.codeItemId = $("#" + codeItemId);
            this.codeId = null;
            this.checkState = -1;
            this.loaded = false;
            this.imageItemId.css("cursor" ,"pointer");
            this.imageItemId.bind("click",function(){
                that.load();
            });
            this.inputItemId.keyup(function(){
                that.checkState = -1;
            });
        },

        load : function() {
            this.request("do=gencode", this.loadRequestCallback, this, true, "");
        },

        request : function (requestDate, cb, obj, sync, newUrl) {
            if (!obj) {
                obj = this;
            }
            $.ajax({
                url : newUrl == "" ? this.serviceUrl : newUrl,
                type : "POST",
                async : sync ? false : true,
                data : requestDate,
                success : function (response) {
                    cb.call(obj, response);
                }
            });
        },

        checkRequestCallback : function (type, json, http) {
            if (type == "load") {
                this.checkState = json["success"] ? 1 : 0;
            }
        },

        filterInput : function (inputText) {
            var text = inputText.replace(/(\s)+/, "");
            var returnValue = "";
            for (var i = 0; i < text.length; ++i) {
                if (text.charCodeAt(i) == 12288) {
                    returnValue += String.fromCharCode(text.charCodeAt(i) - 12256);
                } else if (text.charCodeAt(i) > 65280 && text.charCodeAt(i) < 65375) {
                    returnValue += String.fromCharCode(text.charCodeAt(i) - 65248);
                } else {
                    returnValue += String.fromCharCode(text.charCodeAt(i));
                }
            }
            return returnValue;
        },

        checkNums : function(sCodes) {
            return sCodes.match(/^\d*$/);
        },

        loadRequestCallback : function (responseText) {
            var response = JSON.parse(responseText);
            if (response.success) {
                this.imageItemId.attr("src", this.showUrl + "?id=" + response.id);
                this.inputItemId.val("");
                this.codeId = response.id;
                this.codeItemId.val(this.codeId);
                this.loaded = true;
                this.checkState = -1;
            }
        },

        check : function () {
            if (this.checkState != -1) {
                return this.checkState == 1;
            }
            var inputCode = this.filterInput(this.inputItemId.val());		// 去掉空格
            if (inputCode.length != 4) {
                return false;
            }
            var requestData = "do=checkcode&fn=" + this.codeId + "&cv=" + inputCode;
            this.request(requestData, this.checkRequestCallback, this, true, "");

            return this.checkState == 1;
        },

        checkActiveCode : function(activeCode,inputVerifyCode, verifyValue, pc_type, pc_harddevice,callBackFunc){
            var params = "do=checkcode&code=" + activeCode + "&vc=" + inputVerifyCode + "&vk=" + verifyValue + "&type=" + pc_type + "&hard=" + encodeURIComponent(pc_harddevice);
            this.request(params, callBackFunc, this, true, this.activeUrl);
        }

    }
});



