define(function (require) {

  // посредник
  var vent = require('libs/vent');
  var modal = require('modal');

  var Cites = require('collection/location/cites');
  var Streets = require('collection/location/streets');

  var Modal = {
    create: require('view/modal/create'),
    read: require('view/modal/read'),
    group: require('view/modal/group'),
    avatar: require('view/modal/avatar'),
    location: require('view/modal/location'),
  };

  return {
    Collections : {
      Cites: {},
      Streets: [],   // коллекции
    },
    Models : {},        // модели
    Views : {},         // вьюхи
    vent: vent,

    log: function (log) {
      // логгирование
      if (this._debug == true) console.log('log: ' + log);
    },
    init: function () {
      var vent = this.vent;
      // подписываем мастера modal для очереди модальных окон
      vent.subscribe(vent, 'modal:read', _.bind(this.proxy, this, 'read'));
      vent.subscribe(vent, 'modal:create', _.bind(this.proxy, this, 'create'));
      vent.subscribe(vent, 'modal:avatar', _.bind(this.proxy, this, 'avatar'));
      vent.subscribe(vent, 'modal:group',  _.bind(this.proxy, this, 'group'));
      vent.subscribe(vent, 'modal:cites', _.bind(this.proxy, this, 'cites'));
      vent.subscribe(vent, 'modal:streets', _.bind(this.proxy, this, 'streets'));
    },
    back: function (model) {
      // удаим из стека предыдущее окно
      this.vent.map.pop();
      var method = this.vent.map[this.vent.map.length - 1];
      this.log('[ modal/back ] method = ' + method);
      this.proxy(method, model);
    },
    close: function (model) {
      // this.vent.map.pop();
      this.log('[ modal/close ]');
    },

    // проксирующий метод, проксирует методы для модальных окон
    // используя карту this.map
    proxy: function (method, model) {
      this.log('[ modal/proxy ] map = ' + this.vent.map);
      // console.log(method)
      if (method === undefined) return false;
      // имя запрашиваемого модального окна
      // если отдельного метода нет, то default
      var modal = (this[method] != undefined)
        ? this[method](model, method)
        : this.default(model, method);
      // кнопка back -> назад
      this.vent.listenToOnce(modal, 'back', _.bind(this.back, this));
      // при закрытии окна, закрываем
      this.vent.listenToOnce(modal, 'close', _.bind(this.close, this));
      // запустим модальное окно
      modal.show();
    },

    read: function (model, method) {
      this.log('[ modal/read ] ');
      this.log( JSON.stringify(model.toJSON()) );
      // подгрузим город или навесим триггер
      model = this.getCity(model);
      // подгрузим улицу или навесим триггер
      model = this.getStreet(model);

      var modal = new Modal[method]({
        collection: this.Collections.Contacts,
        model: model
      });
      // при синхронизации location, перерисуем модальное окно
      modal.listenTo(model, 'change:location', modal.render);
      return modal;
    },

    create: function (model, method) {
      this.log('[ modal/' + method + ' ]');
      // подгрузим город или навесим триггер
      model = this.getCity(model);
      // подгрузим улицу или навесим триггер
      model = this.getStreet(model);

      var modal = new Modal[method]({
        collection: this.Collections.Contacts,
        model: model
      });
      return modal;
    },

    group: function (model, method) {
      this.log('[ modal/' + method + ' ]');

      var collection = this.Collections.Contacts;
      model.set({groupsC: collection.groups});

      var modal = new Modal[method]({
        collection: collection,
        model: model
      });
      return modal;
    },

    cites: function (model, method) {
      this.log('[ modal/' + method + ' ] ');

      if ( !this.Collections.Cites.length )
        this.Collections.Cites = new Cites();

      var modal = new Modal.location({
        collection: this.Collections.Cites,
        model: model,
      });

      modal.location_id = 'city_id';
      return modal;
    },

    streets: function (model, method) {
      this.log('[ modal/' + method + ' ] ');

      var city_id = model.get('city_id');

      if ( this.Collections.Streets[city_id] === undefined ) {
        var streets = this.Collections.Streets[city_id] = new Streets();
        streets.city_id = city_id;
        streets.fetch();
      }

      var modal = new Modal.location({
        collection: this.Collections.Streets[city_id],
        model: model,
      });

      modal.location_id = 'street_id';

      return modal;
    },

    getCity: function (model) {
      this.log('[ modal/get/city ]');
      var city_id = model.get('city_id');
      if (!city_id) return model;

      model.set({location: ['Loading...']});

      // если еще не подгрузили города, подгрузим
      var cites = this.Collections.Cites;

      // навешивает на модель триггер для location
      var func = function (model) {
        var location = model.get('location');
        var cityName = cites.get(city_id).get('name');
        var streetName = location[1]||'';

        model.set({location: [cityName, streetName]});
        return model;
      };
      if ( cites.length == undefined ) {
        cites = new Cites();
        // событие при синхронизации, изменим location
        model.listenToOnce(cites, 'sync', _.bind(function (cites) {
          this.log('[ modal/get/cites ] fetch');
          this.Collections.Cites = cites;
          return func(model);
        }, this));
        return model;
      };

      return func(model);
    },

    getStreet: function (model) {
      this.log('[ modal/get/street ]');
      var city_id = model.get('city_id');
      var street_id = model.get('street_id');
      if (!city_id && !street_id) return model;
      // если еще не подгрузили улицы, подгрузим
      var streets = this.Collections.Streets[city_id];

      // навешивает на модель триггер для изменения location
      var func = function (model) {
        var location = model.get('location');
        var cityName = location[0]||null;
        var streetName = streets.get(street_id).get('name');
        model.set({location: [cityName, streetName]});
        return model;
      };

      if ( streets == undefined ) {
        streets = new Streets();
        streets.city_id = city_id;
        streets.fetch();
        // при синхронизации, добавим улицу
        model.listenToOnce(streets, 'sync', _.bind(function (streets) {
          this.log('[ modal/get/street ] fetch');
          this.Collections.Streets[city_id] = streets;
          model = func(model);
        }, this));
        return model;
      };

      return func(model);
    },

    default: function (model, method) {
      this.log('[ modal/' + method + ' ]');

      var modal = new Modal[method]({
        collection: this.Collections.Contacts,
        model: model
      });
      return modal;
    },
  };
});
