define(function () {

  return Backbone.Router.extend({

    initialize: function () {
    },

    routes: {
      '': 'index',
      'contact/:id': 'contactRead',
    },

    index: function () {
     },

    contactRead: function (id) {
      var model = app.Collections.Contacts.get(id);
      var modal = app.Modules.modal;
      modal.vent.publish('modal:read', model);
    },

  });
});
