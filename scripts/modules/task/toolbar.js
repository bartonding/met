define(function (require, exports, module) {

var View = require('./view');
var Model = require('./model');

var TaskToolbar = Backbone.View.extend({

    className : 'met-task-toolbar',

    initialize : function () {
        this.el = $(this.el);
        this.render();
    },

    render: function () {

    },



});

return TaskToolbar;

});