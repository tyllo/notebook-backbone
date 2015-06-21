define(function (require) {

  var template = require('text!templates/modal/read.html');
  var Modal = require('view/modal/modal');

  // Представление пользователя
  return Modal.extend({

    name: 'read',

    template: _.template(template),

    events: {
      'click button[name="back"]'   : 'back',
      'click button[name="close"]'  : 'close',
      'click button[name="delete"]' : 'destroy',

      'click button[name="edit"]'   : 'modalCreate',
      'click a[href$="group"]'      : 'modalGroup',
      'click input[name="star"]'    : 'toggleFavorite',
    },

    // модальное окно для редактирования
    modalCreate: function (e) {
      e.preventDefault();
      this.close();
      this.vent.publish('modal:create', this.model);
    },

    // модальное окно для редактирования
    modalGroup: function (e) {
      e.preventDefault();
      this.close();
      this.vent.publish('modal:group', this.model);
    },

    toggleFavorite: function () {
      this.model.toggleFavorite({save: true});
    },

  });
});
