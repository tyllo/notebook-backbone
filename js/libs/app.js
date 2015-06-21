// Переопределим шаблонизатор underscore
_.templateSettings = {
  evaluate:    /\{=(.+?)\}\}/g,
  interpolate: /\{\{(.+?)\}\}/g,
  escape:      /\{\{-(.+?)\}\}/g
};
// откуда берем данные
server = 'http://notebook.xdraw.ru/';

define(function (require) {

  var Menu = require('view/menu');
  var ViewContacts = require('view/contacts');
  var Contacts = require('collection/contacts');
  var Router = require('router/router');

  var modal = require('libs/modal');

  return {
    Collections : {},   // коллекции
    Models : {},        // модели
    Views : {},         // вьюхи
    Modules: {},        // модули
    _debug : false,     // отладочные сообщения

    log: function (log) {
      // логгирование
      if (this._debug == true) console.log('log: ' + log);
    },
    _init: function () {
      modal = _.extend(this, modal);
      this.Modules.modal = modal;
      // активируем модуль инит
      // он управляет модальными окнами
      modal.init();
    },
    // запуск приложения
    start: function (str) {

      if (str === 'debug') this._debug = true;

      this._init();
      // подгрузим контакты
      this.Collections.Contacts = new Contacts();

      // подгрузка меню
      this.Views.Menu = new Menu({
        collection: this.Collections.Contacts
      });

      // основное вью с контактами
      this.Views.Contacts = new ViewContacts({
        collection: this.Collections.Contacts
      });

      this.Collections.Contacts.listenToOnce(
        this.Collections.Contacts, 'sync', _.bind(this.router, this)
      );
    },

    router: function () {
      // запустим роутер
      this.router = new Router();

      // Запускаем HTML5 History push
      Backbone.history.start({ pushState:true, root: '/' });

    },

    // включить режим логиривания
    debug: function () {
      // создадим тестовый контакт на сервере и браузере
      var collection = this.Views.Contacts.collection;
      collection.create({
        avatar     : 'avatar-0',
        name       : 'Имя',
        surname    : 'Фамилия',
        patronymic : 'Отчество',
        nickname   : 'Прозвище',
        location   : 'Владивосток, ул. Чапаева, 3',
        groups     : ['Группа 1', 'Группа 2'],
        phones     : ['2 (342) 343-2432', '7 (243) 234-3454'],
        city_id    : 26,
        street_id  : 27243,
        date       : '2015-05-28',
      },{wait: true});
    },
  };
});
