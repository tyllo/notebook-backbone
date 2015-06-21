define(function (require) {

  var Color = require('model/color');

  // Представление пользователя
  return Backbone.Model.extend({

    // значения атрибутов todo по умолчанию
    defaults: {
      name       : null,
      surname    : null,
      patronymic : null,
      nickname   : null,

      avatar     : 'avatar-0',
      phones     : null,
      emails     : null,
      favorite   : false,
      date       : null,
      groups     : [],
      location   : [],

      display: 'error',
    },

    // Инициализация
    initialize: function () {
      // установим ФИКСИРОВАННЫЙ рандомный фоновый цвет у авы контакта
      // var color = new Color().rand();
      // установим меняющийся рандомный фоновый цвет у авы контакта
      var color = new Color();
      this.set({color: color}, {silent:true});
      // var date = (new Date(this.get('date')).getTime())/1000;
      // this.set({date: date}, {silent:true});
    },

    validate: function (attrs, options) {
      // if (this.phones == []) this.phones = null;
      // if (this.groups == []) this.groups = null;
      // if (this.emails == []) this.emails = null;
    },

    parse: function (response) {
      // if (response.phones == null) response.phones = [];
      // if (response.groups == null) response.groups = [];
      // if (response.emails == null) response.emails = [];
      // response.groups = [];
      return response;
    },

    // добавим новый элемент в группу
    // и отсортируем согласно юникоду
    addGroup: function (group) {
      var groups = this.get('groups')||[];
      groups.push( group );
      groups.sort();
      this.set({groups: groups},{silent:false});
      if ( !this.isNew() ) this.save();
      return this;
    },

    // переключение существующей группы
    toggleGroup: function (group) {
      // console.log('toggleGroup');
      var groups = this.get('groups')||[];
      var index  = _.indexOf(groups, group);
      // если элемента нет в массиве, добавим его
      if ( index == -1 )
        // добавим в группы и сохраним
        groups.push(group);
      else
        // удалим group из массива group
        groups = _.without(groups, group);

      this.set({groups: groups.sort()});

      if ( !this.isNew() ) this.save();
    },

    // переключаем звездочку
    toggleFavorite: function (options) {
      options = options||{};
      this.set({favorite: !this.get('favorite')}, options);
      if (options.save) this.save();
    },

    // сменим аватар
    addAvatar: function (avatar, options) {
      options = options||{};
      this.set({avatar: avatar}, options);
      return this;
    },

    // обновим эту модель в коллекции по полученной
    // измененной копии и генерируем событие update
    update: function (model) {
      this.collection.add(model,{ merge:true });
      // обновим измененную модель на сервере
      // и определим callback при удачном ответе
      this.save()
        .done( function ( data, err ) {
          console.log('sync done!!');
        })
        .fail( function( data, err ) {
          console.log('fail');
          console.log(err);
        });
    },

    // очищаем значение
    cleanValue: function (name, value) {
      if ( name[name.length - 1] == ']' ) {
        name = name.replace('[]','');
        var arr = this.get(name);
        arr = _.without(arr, value);
        this.set(name, arr);
      } else {
        this.set(name, null);
      };
    },

    // добавим значение
    setValue: function (name, value) {
      if ( name[name.length - 1] == ']' ) {
        name = name.replace('[]','');
        var arr = this.get(name);
        arr = _.without(arr, value);
        arr.push(value);
        this.set(name, arr, {validate:true});
      } else {
        this.set(name, value);
        this.isValid();
      };
    },
  });
});
