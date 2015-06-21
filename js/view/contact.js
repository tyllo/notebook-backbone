define(function (require) {

  var template = require('text!templates/contact.html');

  // Представление пользователя
  return Backbone.View.extend({

    tagName: 'article',
    className: 'col-xs-4 col-sm-2 col-md-1',

    template: _.template(template),

    events: {
      'click .over':             'modalRead',
      'click a[href$="read"]':   'modalRead',
      'click a[href$="delete"]': 'destroy',
    },

    // Инициализация
    initialize: function (model) {
      // при удалении модели - удалим вью
      this.listenTo(this.model,'destroy', this.remove);
      // при изменении модели, перерисум ее
      this.listenTo(this.model,'change', this.render);
      // в одном месте добавим модуль
      this.vent = app.Modules.modal.vent;
    },

    render: function () {
      var modal = this.model.toJSON();
      var template = this.template( modal );
      this.$el.html( template );
      return this;
    },

    //вывести контакт в модальном окне
    modalRead: function(e) {
      e.preventDefault();
      e.stopPropagation();
      // генерируем событие создания модального окна
      this.vent.publish('modal:read', this.model);
    },

    // удалить контакта с сервера и коллекции
    destroy: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.model.destroy();
    },
  });
});
