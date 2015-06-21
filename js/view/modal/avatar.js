define(function (require) {

  var template = require('text!templates/modal/avatar.html');
  var Modal = require('view/modal/modal');

  // Представление пользователя
  return Modal.extend({

    name: 'avatar',

    template: _.template(template),

    events: {
      'click button[name=back]' : 'back',
      'click a.thumbnail'        : 'addAvatar',
    },

    // сменим аватар
    addAvatar: function (e) {
      e.preventDefault();
      // обновим аватарку у модели
      var avatar = e.target.className;
      this.model.addAvatar( avatar );
      this.back();
    },
  });
});
