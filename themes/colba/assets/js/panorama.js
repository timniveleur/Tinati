$(window).load(function () {
    ymaps.ready(function () {
        if (!ymaps.panorama.isSupported()) {
            return;
        }
        ymaps.panorama.locate([55.76356261, 37.60570446]).done(
            function (panoramas) {
                if (panoramas.length > 0) {
                    var player = new ymaps.panorama.Player(
                        'contacts-map',
                        panoramas[0], {
                            direction: [100, 0]
                        }
                    );
                }
            },
            function (error) {
                alert(error.message);
            }
        );
    });
});