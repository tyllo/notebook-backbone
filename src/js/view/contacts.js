define(function (require) {

  var ViewContact = require('view/contact');

  // Представление пользователя
  return Backbone.View.extend({

    el: '#contacts',

    // Инициализация
    initialize: function () {
      // как только коллекция обновится, запускаем рендер
      this.listenTo(this.collection, 'add', this.renderOne);
    },

    // Выводим записную книжку,
    // перебрав все контакты из коллекции
    render: function () {
      // опустошим контейнер
      this.$el.empty();
      // отсортируем коллекцию
      this.collection.sort();
      // а теперь перерисуем всех контактов
      this.collection.each(function (item) {
        this.renderContact(item);
      }, this);

      return this;
    },

    // выводим запись контакта с помощью создания представления
    // ViewContact и добавим contactItem в contactItemEl
    renderOne: function (item) {
      var viewContact = new ViewContact({model: item});
      this.$el.append( viewContact.render().el );
      return this;
    }
  });
});
