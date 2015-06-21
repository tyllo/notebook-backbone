define(function (require) {

  var template = require('text!templates/modal/locationItem.html');

  // Представление пользователя
  return Backbone.View.extend({

    tagName: 'section',

    template: _.template(template),

    name: 'location/Item',

    log: function (log) {
      app.log('[ view/' + this.name + ' ] ' + log);
    },

    events: {
    },

    // Инициализация
    initialize: function (model) {
      this.log('initialize');
      // при удалении модели - удалим вью
      this.listenTo(this.model,'destroy', this.remove);
      // при изменении модели, перерисум ее
      this.listenTo(this.model,'change', this.render);
      // в одном месте добавим модуль
      this.vent = app.Modules.modal.vent;
    },

    render: function () {
      // this.log('render');
      var modal = this.model.toJSON();
      var template = this.template( modal );
      this.$el.html( template );
      return this;
    },

  });
});
