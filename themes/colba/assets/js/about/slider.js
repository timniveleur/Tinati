$(function() {
    $('.js-slider-about-about').slick({
        slidesToScroll: 1,
        slidesToShow: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        variableWidth: true,
        arrows: false,
    });
        $('.js-slider-about-awards').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        draggable: true,
        touchMove: true,
        swipe: true,
        variableWidth: false,
        autoplay: true,
        autoplaySpeed: 3000,
        mobileFirst: true,
        dots: true,
        arrows: false,
        responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    variableWidth: true,
                    dots: false,
                },
            },
        ]
    })
})