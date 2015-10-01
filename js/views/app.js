/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/todos',
    'views/todos',
    'text!templates/stats.html',
    'common'
], function ($, _, Backbone, Todos, TodoView, statsTemplate, Common) {
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({
        el: '#todoapp',
        template: _.template(statsTemplate),
        events: {
            'keypress #new-todo':		'createOnEnter',
            'click #clear-completed':	'clearCompleted',
            'click #toggle-all':		'toggleAllComplete'
        },

        initialize: function () {
           // this.allCheckbox = this.$('#toggle-all')[0];
            this.$input = this.$('#new-todo');
            this.$main = this.$('#main');
            this.$todoList = this.$('#todo-list');

            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'change:completed', this.filterOne);
            this.listenTo(Todos, 'filter', this.filterAll);
            this.listenTo(Todos, 'all', _.debounce(this.render, 0));

            Todos.fetch({reset:true});
        },
        render: function () {
            var completed = Todos.completed().length;
            var remaining = Todos.remaining().length;

            if (Todos.length) {
                this.$main.show();
            } else {
                this.$main.hide();
                this.$footer.hide();
            }

            //this.allCheckbox.checked = !remaining;
        },

        addOne: function (todo) {
            var view = new TodoView({ model: todo });
            this.$todoList.append(view.render().el);
        },

        newAttributes: function () {
            return {
                title: this.$input.val().trim(),
                order: Todos.nextOrder(),
                completed: false
            };
        },

        createOnEnter: function (e) {
            if (e.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
                return;
            }

            Todos.create(this.newAttributes());
            this.$input.val('');
        },

        toggleAllComplete: function () {
            var completed = this.allCheckbox.checked;

            Todos.each(function (todo) {
                todo.save({
                    completed: completed
                });
            });
        }
    });

    return AppView;
});
