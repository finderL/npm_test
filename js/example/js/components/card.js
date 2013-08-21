// 功能描述：卡片功能，
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        init : function (options) {
            var that = this;
            var options = options || {};  //  参数对象
            var t = options.trigger || "#container";  // 参数：触发元素
            var p = options.popblk || "#container";  // 参数：弹出元素
            var renderContent = options.renderFun || function(){};
            this.__cardPopUp(t, p, renderContent);
        },

        __cardPopUp : function (trigger, popblk, callBack) {
            var delayed_to_show, delayed_to_hide, render_section_card, set_card_position, render_and_locate;
            $('body').off('mouseenter', trigger);
            $('body').off('mouseleave', trigger);
            $('body').off('mouseenter', popblk);
            $('body').off('mouseleave', popblk);
            $('body').on('mouseenter', trigger, function (e) {
                var $this = $(this);
                delayed_to_show = setTimeout(function () { render_and_locate(e, popblk); }, 200);
            }).on('mouseleave', trigger, function () {
                    clearTimeout(delayed_to_show);
                    delayed_to_hide = setTimeout(function () { $(popblk).hide(); }, 200);
                });

            $('body').on('mouseenter', popblk, function () {
                clearTimeout(delayed_to_hide);
            }).on('mouseleave', popblk, function () {
                    $(popblk).hide();
                });

            render_and_locate = function(current_mouse, popblk){
                var $card = render_section_card(popblk);
                set_card_position(current_mouse, $card);
            };

            render_section_card = function (popblk){
                return $(popblk);
            };

            set_card_position = function (e, $card) {
                var left = null;
                var top = null;
                // mouseenter定位
                var pWidth = $card.width();  // 弹出元素宽度
                var pHeight = $card.height(); // 弹出元素高度
                var tWidth = $(e.target).parent()[0].clientWidth; // 目标元素宽度
                var tHeight = $(e.target).parent()[0].clientHeight; // 目标元素高度
                var leftOffset = $(e.target).offset().left; // 目标元素left
                var topOffset = $(e.target).offset().top;  // 目标元素top
                var bWidth = $(window).width();
                var bHeight = $(window).height();
                var wHeight = $(window).scrollLeft(); // 滚动条宽度
                var sHeight = $(window).scrollTop(); // 滚动条高度
                var offsetToLeft = bWidth - leftOffset - tWidth + wHeight;
                var offsetToBottom = bHeight - topOffset - tHeight + sHeight;
                    // 卡片定位
                if( offsetToLeft >= pWidth){
                    left = leftOffset + tWidth/4;
                }else{
                    left = leftOffset - pWidth;
                }

                if( offsetToBottom >= pHeight){
                    top = topOffset +tHeight/2;
                }else{
                    top = topOffset - pHeight;
                }

                $card.css({ left:left, top:top });
                setTimeout(function () { $("body").append($card); }, 100);
                $card.show();
                callBack(e, $card);
            };
        }
    };
});