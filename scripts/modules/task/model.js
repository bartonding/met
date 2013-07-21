define(function (require, exports, module) {

var iDate  = require('core/idate');

var DEFAULT_TEXT = '起个名吧...';

var TaskModel = Backbone.Model.extend({

    defaults: {
        text: DEFAULT_TEXT,
        top: 0,
        className: 'met-task-item',
        startDate: new Date(),
        endDate: iDate.increase(7)
    },

    initialize: function () {}
});

return TaskModel;

});