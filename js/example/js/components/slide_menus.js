// 功能描述：菜单下拉
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        // init 初始化
        init : function (options) {
            var that = this;
            var options = options || {};  //  参数对象
            var o = options.targetElement || ".slideTrigger";  // 参数：触发元素类/id名
            var p = options.parentElement || "li.ui-tab-title";  // 参数：触发元素父元素类/id名
            var type = options.eventType || "mouseenter";
            var k = options.childElement || ".slideCon";  // 参数：触发元素相邻元素类/id名
            var h = options.currentName || undefined;    // 参数：当前状态的类
            var t1 = options.enterTime || 0;    // 参数：鼠标进入触发事件延迟时间间隔
            var t2 = options.leaveTime || 0;    // 参数：鼠标移出触发事件延迟时间间隔
            var c = options.callback;    // 参数：回调函数
            var eid = "";   // 变量：鼠标enter id
            var lid = "";   // 变量：鼠标enter id
            h = h.slice(1);
            $("body").off(options.eventType, o);
            if( options.eventType === "mouseenter" ) {
                $("body").on("mouseenter", o, function(){
                    var self = this;
                    that.enter(self, eid, lid, h, k, t1, c);
                });
                $("body").on("mouseleave", p, function(){
                    var self = this;
                    that.leave(self, o, eid, lid, h, k, t2);
                });
            }
            if( options.eventType === "click" ){

                $("body").on(options.eventType, o, function(){
                    var self = this;
                    if($(self).hasClass(h)){
                        var $parent = $(self).parent();
                        that.leave($parent, o, eid, lid, h, k, t2);
                    }
                    else{
                        that.enter(self, eid, lid, h, k, t1, c);
                    }
                });
            }
        },
        //  mouseenter触发
        enter : function(self, eid, lid, currentName, childElement, enterTime, callback){
            var $me = $(self);
            clearTimeout(eid);
            if(callback) {
                callback($me);
            }
            lid = setTimeout(function(){
                if( currentName !== undefined ){
                    $me.addClass(currentName);
                }
                $me.siblings(childElement).show();
            }, enterTime);
        },
        //  mouseleave触发
        leave : function(self, o, eid, lid, currentName, childElement, leaveTime){
            var $me = $(self);
            eid = setTimeout(function(){
                if( currentName !== undefined ){
                    $me.children(o).removeClass(currentName);
                }
                $me.children(childElement).hide();
                return false;
            }, leaveTime);
            clearTimeout(lid);
            
        }
    };
});