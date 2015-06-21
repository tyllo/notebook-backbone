define(function (require) {

  // vent - посредник!
  return _.extend({
    // карта для pub/sub
    map: [],
    // добавим методы посредника vent.publish = vent.trigger;
    publish: function (events, obj, options) {
      // разделим events = master1:slave1 master2:slave2
      _.each(events.split(/\s+/), function(event) {
        // разделим event = master:slave
        var master = event.split(':')[0];
        var slave  = event.split(':')[1];
        // добавим событие в карту
        this.map.push(slave);
        // запустим триггер
        this.trigger(master, obj, options);
        this.trigger(event,  obj, options);
      }, this);
    },

    subscribe: function (obj, events, callback) {
      return this.listenTo(obj, events, callback)
    },
    unsubscribe: function (obj, events, callback) {
      return this.stopListening(obj, events, callback)
    },
  }, Backbone.Events);
})
