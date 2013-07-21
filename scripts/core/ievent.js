define(function (require, exports, module) {

// var iEvent = {};
// _.extend(iEvent, Backbone.Events);

var slice = Array.prototype.slice;

var callbacks = {};

var splitEventString = function (str) {
    return str.replace(/^\s+/,'').replace(/\s+$/,'').split(/\s+/);
};

var iEvent = {

    on: function (etype, fn) {
        if (!callbacks[etype]) {
            callbacks[etype] = [];
        }
        callbacks[etype].push(fn);
    },

    trigger: function () {
        if (arguments.length === 0) return;
        var events = splitEventString(arguments[0]);
        var args = slice.call(arguments, 1);

        _.each(events, function (etype) {
            _.each(callbacks[etype] || [], function (fn) {
                window.setTimeout(function () {
                    fn.apply(null, args);
                }, 0);
            });
        });
    }
};

window.iEvent = iEvent; // for test

return iEvent;

});