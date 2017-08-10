$(document).ready(function() {
    //首先将.page-component-up隐藏
    $(".page-component-up").hide();
    //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
    $(function() {
        $(window).scroll(function() {
            if ($(window).scrollTop() > 100) {
                $(".page-component-up").fadeIn(1000);
            }
            else {
                $(".page-component-up").fadeOut(1000);
            }
        });
        //当点击跳转链接后，回到页面顶部位置
        $(".page-component-up").click(function() {
            $('body,html').animate({
                scrollTop: 0
            },
            100);
            return false;
        });
    });
});
