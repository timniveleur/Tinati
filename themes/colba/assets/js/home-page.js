$(function(){
    if($(window).scrollTop() <= $('#home-colors').offset().top){
            $('.normal-aside').addClass('transparent');
    }
    $(window).scroll(function(){
        st = $(this).scrollTop();
        lastScrollTop = st <= 0 ? 0 : st;
        if(st + 40 >= $('#home-colors').offset().top){
            $('.normal-aside').removeClass('transparent');
        }
        if(st <= $('#home-colors').offset().top - 20){
            $('.normal-aside').addClass('transparent');
        }
    })
        ymaps.ready(init);
    function init(){ 
        var myMap = new ymaps.Map("map", {
            center: [55.763556, 37.605697],
            zoom: 16
        })
        var myPlacemark = new ymaps.Placemark([55.763556, 37.605697], {
            balloonContent: 'Москва, Большой Гнездниковский переулок, 10',
            iconCaption: 'Colbacolorbar'
        }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: '/themes/colba/assets/images/mnicon.svg',
            iconImageSize: [40, 50],
            iconImageOffset: [-20, -30]
        });
        myMap.geoObjects.add(myPlacemark);
    }
})
