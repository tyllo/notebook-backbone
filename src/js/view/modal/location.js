define(function (require) {

  var template = require('text!templates/modal/location.html');
  var LocationItem = require('view/modal/locationItem');

  // Представление пользователя
  return Backbone.View.extend({

    className: 'modal',

    // куда будем вставлять
    selector: '#modal',

    name: 'location',

    // city_id или street_id
    location_id: '',

    template: _.template(template),

    log: function (log) {
      app.log('[ view/' + this.name + ' ] ' + log);
    },

    events: {
      'click button[name="back"]'   : 'back',
      'click button[name="update"]' : 'updateLocation',

      'click label'                 : 'toggleGroup',
      'keyup input[name="filter"]'  : 'keyAction',
    },

    // Инициализация
    initialize: function () {
      this.log('initialize');
      // в одном месте добавим модуль
      this.vent = app.Modules.modal.vent;
      // как только коллекция обновится, запускаем рендер
      this.listenTo(this.collection, 'sync', this.show);
    },

    render: function () {
      this.log('render');
      // сбросим display: none
      this.collection.displayToggle('');
      var template = this.template();
      this.$el.html( template );
      this.trigger('render', this);
      return this;
    },

    // откроем модальное окно
    show: function () {
      this.log('show');
      // вставим основу модального окна в DOM
      this.render().$el.prependTo(this.selector);
      this.renderLocation();
    },

    // Выводим список локаций,
    // перебрав все локации из коллекции
    renderLocation: function () {
      $el = this.$el.find('#location');
      $el.empty();
      // а теперь перерисуем все локации
      this.collection.each(function (item) {
        this.renderLocationItem(item, $el);
      }, this);

      // запустим модальное окно twitter bootstrap
      this.$el.modal({show:true, backdrop:'static'});
     },

    // выводим запись локации с помощью создания представления
    renderLocationItem: function (item, $el) {
      var locationItem = new LocationItem({model: item});
      $el.append( locationItem.render().el );
      return this;
    },

    // автокомплит, скрывает что не попадает под маску
    keyAction: function (e) {
      // спец. сочетание - не обрабатываем
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      var value = $(e.target).val().toLowerCase();
      // по value скроем элементы, которые неподходят
      this.collection.displayToggle(value);
    },

    updateLocation: function (e) {
      var $input = this.$el.find('input:checked');
      var value = $input.val();
      if ( value === undefined) return false;
      this.model.set(this.location_id, value);
      e.preventDefault();
      if (this.location_id == 'city_id'){
        this.close();
        this.vent.publish('modal:streets', this.model);
      } else {
        this.vent.map.pop();
        this.back();
      }
    },

    _hide: function () {
      this.$el.modal('hide');
      this.remove();
     },

    // закроем модальное окно
    close: function () {
      this.log('close');
      this._hide();
      this.trigger('close', this.model);
     },

    // предыдущее модальное окно
    back: function () {
      this.log('back');
      this._hide();
      this.trigger('back', this.model);
     },

  });
});
