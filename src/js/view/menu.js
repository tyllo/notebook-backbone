define(function (require) {

  var template = require('text!templates/nav-bar.html');
  var Contact = require('model/contact');

  // Представление меню
  return Backbone.View.extend({

    el: 'body header',

    template: _.template(template),

    events: {
      'click a[href$="create"]' : 'modalCreate',
      'click input[name="star"]' : 'favoriteContacts',
    },

    // Инициализация
    initialize: function () {
      this.$el.html(this.template());
      this.vent = app.Modules.modal.vent;
    },

    // модальное окно для редактирования
    modalCreate: function (e) {
      e.preventDefault();
      this.vent.publish('modal:create', new Contact());
    },

    // показываем все или только favorite
    favoriteContacts: function (e) {
      var checked = $(e.target).prop('checked');
      this.collection.favoriteContacts(checked);
    },
  });
});
