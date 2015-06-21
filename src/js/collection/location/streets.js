define(function () {

  var Streets = Backbone.Model.extend({
    defaults: {
      display: 'error'
    },
  });

  // Коллекция улиц города cityId
  return Backbone.Collection.extend({

    model: Streets,

    url: function () {
      return server + 'get/street/' + this.city_id;
    },

    initialize: function () {
      // подгрузим список городов json
      // this.fetch();
    },

    // При добавлении модели сортируем
    // улицы в алфавитном порядке
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
