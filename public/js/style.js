/**
 * Created by Joye on 2016-07-06.
 */
var Appearance = {
    init: function () {
        this.guideHighlighter();
    },
    guideHighlighter: function () {
        $('.top-nav li:not("here")').hover(function(){
            $(this).addClass('nav-on');
        },function () {
            $(this).removeClass('nav-on');
        });
    }
};
Appearance.init();