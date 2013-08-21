// 功能描述：多余字符省略号显示，鼠标滑过弹出tooltip
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        // init 初始化
        init : function (options) {
            var that = this;
            var options = options || {};  //  参数对象
            var o = options.targetObj || ".limit";  // 参数：输入框类/id名
            var n = options.numLimited || 15;    // 参数：限定显示字符数量
            var t = options.tip || "#tooltip";    // 参数：提示框类/id名
            var x = options.xOffset || 10;    // 参数：提示框相对偏移量x
            var y = options.yOffset || 20;    // 参数：提示框相对偏移量y
            var z = options.zLevel || 99999;    // 参数：提示框层级
            var s = options.eventType || "mouseover";    // 参数：触发事件类型
            var style2 = {
                            "cursor" : "pointer",
                            "visibility" : "visible"
                        };
            // 初始化页面dom
            $(o).each(function(){
                var $me = $(this);
                var initValue = $me.text();
                $me.attr("initValue", initValue);
                if( $me.text().length > n ){
                    var textContent = $me.html();
                    $me.text( textContent.substring(0, n - 2) + "…" );
                }
                $me.css(style2);
            });
            $("body").on(s, o, function(e){
                var style1 = {
                            "top" : (e.pageY + y) + "px",
                            "left" : (e.pageX + x) + "px",
                            "z-index" : z
                        };
                var l = $(e.target).attr("initValue").length;
                if( l >= n ){
                    that.displayEllipsis(e, t, style1);
                }
            });
            $("body").on("mouseout", o, function(e){
                if( $(t) ){
                    $(t).remove();
                }
            });
            $("body").on("mousemove", o, function(e){
                var style1 = {
                            "top" : (e.pageY + y) + "px",
                            "left" : (e.pageX + x) + "px",
                            "z-index" : z
                        };
                if( $(t) ){
                    $(t).css(style1);
                }
            });
        },
        //  鼠标滑过弹出tooltip
        displayEllipsis : function (e, tip, style1){
            var $self = $(e.target);
            var valueInit = $self.attr("initValue");
            if( $(tip).length === 0 ){
                var id = tip.slice(1);
                var tooltip = "<div id='"+id +"'>"+ valueInit +"</div>";  //创建 div 元素
                $("body").append(tooltip);
                $(tip).css(style1).show("fast");
            }
        }
    }
});