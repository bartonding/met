define(function (require, exports, module) {


var TemplateString = [
'<div class="<%=className%>">',
'</div>'
].join('');

var TaskView = Backbone.View.extend({

    className : 'met-task-container',

    template : _.template(TemplateString),

    events : {},

    initialize : function () {
        this.el = $(this.el);
    },

    render : function () {
        this.el.html(this.template(this.model.toJSON));
        return this;
    }
});

return TaskView;

});