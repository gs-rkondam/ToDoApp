/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/todos.html',
    'common'
], function ($, _, Backbone, todosTemplate, Common) {
    'use strict';

    var TodoView = Backbone.View.extend({

        tagName:  'li',
        template: _.template(todosTemplate),
        events: {
            'click .toggle':	'toggleCompleted',
            'click .destroy':	'clear'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.$input = this.$('.edit');
            return this;
        },
        toggleCompleted: function () {
            this.model.toggle();
        },

        clear: function () {
            this.model.destroy();
        }
    });

    return TodoView;
});
