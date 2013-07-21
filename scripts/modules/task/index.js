define(function (require, exports, module) {

require('./task.css');

var iDate  = require('core/idate');
var iEvent = require('core/ievent');

var View = require('./view');
var Collection = require('./collection');
var Toolbar = require('./toolbar');

var collection = new Collection();

var TaskApp = Backbone.View.extend({

    className : 'met-task-wrap',

    initialize: function () {
        this.el = $(this.el);
        this.el.append(new Toolbar().el);
        tc.el.append(this.el);

    }


});

var taskApp = new TaskApp();

});