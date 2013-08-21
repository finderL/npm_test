// 功能描述：切换导航，导航触发事件，相应的内容变化
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        // init 初始化
        init : function (options) {
            var that = this;
            var options = options || {};  //  参数对象
            var s = options.eventType || "click";    // 参数：事件类型
            var b = options.noContent || false;    // 参数：是否没有内容，布尔值
            var t = options.tabName || ".tabNav";  // 参数：导航类/id名
            var l = options.contentName || ".contentNav";    // 参数：内容类/id名
            var h = options.currentName || ".current";    // 参数：当前状态的类
            h = h.slice(1);    //  便于添加类名
            var c = options.callback;    // 参数：回调函数
            $("body").off(s, t);
            $("body").on(s, t, function(e){
                var me = this;
                var i = $(t).index(this);
                that.toggleTab(me, l, h, s, b, i, c);
            });
        },
        //  切换导航
        toggleTab : function(self, contentName, currentName, eventType, noContent, index, callback) {
                var main = function (){
                    $(self).addClass(currentName).siblings().removeClass(currentName);
                    if( callback ){
                            callback($(self));
                        }
                }
                if ( noContent == false ){
                    if (eventType === "click" || eventType === "mouseenter"){
                        main();
                        $(contentName).eq(index).show().siblings().hide();
                    }
                }else{
                    main();
                }
        }
    };
});