$(document).ready(function(){
    // NOTE: intro
    $("body > a").on("mouseover", function(){
        $(this).css({"width":"36%"}).siblings().css({"width":"32%"})
        $("body > a").on("mouseleave", function(){
            $("body > a").css({"width":"calc(100%/3)"})
        })
    })
})