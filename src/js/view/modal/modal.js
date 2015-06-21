define(function () {

  return Backbone.View.extend({

    className: 'modal',

    // куда будем вставлять
    selector: '#modal',

    name: 'modal',

    template: '',

    log: function (log) {
      app.log('[ view/' + this.name + ' ] ' + log);
    },

    // Инициализация
    initialize: function () {
      this.log('initialize');
      // в одном месте добавим модуль
      this.vent = app.Modules.modal.vent;
      // подрубим навигацию
      // app.router.navigate(this.name + "/" + this.model.get('id'));
      // при изменении модели перерисуем
      // this.listenTo(this.model, 'change', this.render);
      // при рендеринге вьюхи, навесим обработчики
      this.listenTo(this, 'render', this.handlers);
      return this;
    },

    // добавим модальное окно в DOM
    render: function () {
      this.log('render');
      // добавим элемент в DOM
      var model = this.model.toJSON();
      var template =this.template( model );
      this.$el.html( template );
      this.trigger('render', this);
      return this;
    },

    // откроем модальное окно
    show: function () {
      this.log('show');
      this.render().$el.prependTo(this.selector);
      // запустим модальное окно twitter bootstrap
      this.$el.modal({show:true, backdrop:'static'});
    },

    // навесим события на поля
    handlers: function () {
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

    // удалим модель
    destroy: function () {
      this.log('destroy');
      this._hide();
      this.model.destroy();
    },
  });

});
