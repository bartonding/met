define(function (require, exports, module) {

var TaskModel = require('./model');

var TaskCollection = Backbone.Collection.extend({

    localStorage: new Backbone.LocalStorage('MET-TASKS'),

    model: TaskModel,

    initialize: function () {}

});

return TaskCollection;

});