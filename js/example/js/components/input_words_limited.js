// 功能描述：extarea限定输入字数
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        // init 初始化
        init : function (options) {
            var that = this;
            var options = options || {};  //  参数对象
            var s = options.eventType || "keyup keydown keypress";    // 参数：事件类型 eg:keydown,keypress
            var o = options.inputObj || ".inputObj";  // 参数：输入框类/id名
            var t = options.tip || ".tip";    // 参数：提示类/id名
            var n = options.numLimited || 10;    // 参数：限定字符数量
            var c = options.isCut || false;    // 参数：超出部分是否清空
            $("body").on(s, o, function(e){
                that.changeWordsNum(o, t, n, c);
            });
        },
        //  textarea限定输入字数
        changeWordsNum : function (inputObj, tip, numLimited, isCut){
            var $itemtext_obj = $(tip);
            var $item_obj = $(inputObj);
            var result = $item_obj.val().replace(/(^\s*)|(\s*$)/g, "");
            var length = parseInt(result.length);
            if(length > numLimited){
                if( isCut ){
                    $item_obj.val($item_obj.val().substring(0, numLimited));
                    $itemtext_obj.html("超出<span>" + numLimited + "</span>字，不能再输入");
                }
                else{
                    var num2 = length - numLimited;
                    $itemtext_obj.html("");
                    $itemtext_obj.html("已超出<span>" + num2 + "</span>字");
                }
            }
            if (numLimited >= length){
                var numLimited = numLimited - length;
                $itemtext_obj.html("");
                $itemtext_obj.html("还能输入<span>" + numLimited + "</span>字");
            }
        }
    };
});