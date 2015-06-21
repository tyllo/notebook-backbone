define(function (require) {

  var Contact = require('model/contact');

  // коллекция контактов
  return Backbone.Collection.extend({

    model: Contact,

    // массив с группами из моделей
    groups: [],

    // localStorage: new Backbone.LocalStorage("app.Collection.Contacts"),

    url: function () {
      return server + 'contact';
    },

    initialize: function () {
      // запросим модели с сервера
      this.fetch({
        remove: false,
        // TODO: здесь нужно обработать запрос с сервера
        success: function (collection, response, options) {
          console.log('success fetch')
        },
        error: function (collection, response, options) {
          alert("Ошибка связи с сервером, попробуйте перегрузить страницу");
        },
      });
      // при синхронизации с сервером создадим this.groups
      this.listenToOnce(this, 'sync', this.makeGroups);
      this.listenTo(this, 'change:groups', this.comparatorGroups);
    },

    // При добавлении модели сортируем
    // контакты в алфавитном порядке по имени
    comparator: function (contact) {
      return contact.get('name')||'';
    },

    comparatorGroups: function (item) {
      // console.log('comparatorGroups')
      this.groups = $.merge(this.groups, item || []);
      this.groups = _.union(this.groups);
      this.groups.sort();
    },

    makeGroups: function () {
      _.each( this.pluck('groups'), function (item) {
        this.groups = $.merge(this.groups, item || []);
        this.groups = _.union( this.groups );
      }, this);
      this.groups.sort();
    },

    favoriteContacts: function (checked) {
      if(checked) {
        this.each(function (contact) {
          var favorite = contact.get('favorite');
          if (!favorite) contact.set({display: 'none'})
        });
      } else {
        this.each(function (contact) {
          contact.set({display: false})
        });
      };
    },
  });
});
