define(function (require, exports, module) {

    var iEvent = window.iEvent = require('core/ievent');

    var frequence = 200;
    var timeHandler = null;

    $(window).resize(function () {
        window.clearTimeout(timeHandler);
        timeHandler = window.setTimeout(function () {
            iEvent.trigger('window.resize', $(window).width(), $(window).height());
        }, frequence);
    });

    // var count = 0;
    // iEvent.on('window.resize', function (w, h) {
    //     console.log((++count), '[' + w + ', ' + h + ']');
    // });
});