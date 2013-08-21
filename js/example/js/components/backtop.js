// 功能描述：点击返回顶部
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        // init 初始化
        init : function (options) {
                var that = this;
                var options = options || {};  //  参数对象
                var o = options.mainDom || "#container";  // 参数：内容主体类/id名
                var b = options.bottomHeight || 200;  //  图片距离浏览器底部的距离
                var l = options.leftWidth || 0;    //  图片距离浏览器左侧的距离
                var p = options.imgSrc || "http://image.jiandan100.cn/images/sixyears/backtop.jpg";  //图片src地址
                var $targetDom = $('<div class="r_backtop" style="cursor:pointer;position:fixed"></div>');   // 创建图片放入DOM节点
                var image = new Image();   //    缓存一张空图片
                image.src = p;
                image.alt = "返回顶部";
                $targetDom.html($(image));
                $("body").append($targetDom);
                //  点击返回顶部
                $("body").on("click", ".r_backtop", function () {
                    that.scrollToTop();
                });
                //  鼠标滚动控制元素
                $(window).bind("scroll", that.scrollIt($targetDom, b, l, o) );
        },
        //  鼠标滚动触发
        scrollIt : function($targetDom, bottomHeight, leftWidth, mainDom) {
            var hs = $(document).scrollTop();
            var hW = $(window).height();
            var top = hs + hW;
            var maxHeight = $(document).height();
            var limitTop = hW - 100;
            var startScrollHeight = 5;
            var ie6 = !-[1,] && !window.XMLHttpRequest;   // 前者为判断IE浏览器，后为判断版本
            (hs > startScrollHeight ) ? $targetDom.show() : $targetDom.hide();
            if(top < maxHeight - bottomHeight){
                if ( ie6 ) {
                    top = top - 100;
                }else{
                    top = limitTop;
                }
            }else{
                if ( ie6 ) { 
                    top = top - 100 - (bottomHeight + top - maxHeight);
                }else{
                    top = limitTop - (bottomHeight + top - maxHeight);
                }
            }
            $targetDom.css({"left": $(mainDom).offset().left + leftWidth, "top": top});
        },
        //  鼠标点击触发
        scrollToTop : function () {
            $("html, body").animate({ scrollTop: 0 }, 120);
        }
        
    };
});