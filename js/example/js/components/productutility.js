/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-6-27
 * Time: 上午10:12
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, moudule) {
    var $ = require("jquery");
    var JSON = require("json");
    var activePath = baseUrl + "/service/active/";

    moudule.exports = {
        cancelbuyProc : function(callbackFunc) {
            var sendData = "rnd="+Math.round(Math.random()*1000000000,1);
            sendData += "&do=cancelbuy";
            this.request(activePath,
                "POST",sendData , callbackFunc);
        },

        request : function (url, method, data, callback) {
            $.ajax({
                type : method,
                data : data,
                dataType : 'json',
                url : url,
                success : function(responseText) {
                    callback(responseText);
                }
            })
        },
        buyProc : function(sCourseGUID, callbackFunc, action) {
            var sendData = "rnd="+Math.round(Math.random()*1000000000,1);
            if (action) {
               sendData += "&do=" + action + "&selectvalue=" + sCourseGUID;
            } else {
                 sendData += "&do=getbuyinfo&selectvalue=" + sCourseGUID;
            }
            this.request(activePath, "POST",sendData , callbackFunc);
        }
    }
});