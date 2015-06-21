define(function () {

  var City = Backbone.Model.extend({
    defaults: {
      display: 'error'
    },
  });

  // Коллекция городов
  return Backbone.Collection.extend({

    model: City,

    url: function () {
      return server + 'get/cites';
    },

    initialize: function () {
      // подгрузим список городов json
      this.fetch();
    },

    // При добавлении модели сортируем
    // города в алфавитном порядке
    comparator: function (item) {
      return item.get('name');
    },

    displayToggle: function (value) {
      value = value.trim();
      if (value == '')
        this.map(function (city) {
          city.set({display: false});
        });
      else
      this.map(function (city) {
        var name = city.get('name').toLowerCase();
        // если подстрока есть в сторке
        if (name.indexOf(value) == -1)
          city.set({display: 'none'});
        else
          city.set({display: false});
      });
    },
  });
});
