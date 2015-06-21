define(function (require) {

  var template = require('text!templates/modal/group.html');
  var Modal = require('view/modal/modal');

  // Представление пользователя
  return Modal.extend({

    name: 'group',

    template: _.template(template),

    events: {
      'click button[name="back"]'     : 'back',

      'click button[name="addGroup"]' : 'addGroup',
      'click label'                   : 'toggleGroup',
      'keyup'                         : 'keyAction',
    },

    // переберем все инпуты и отметим checked
    handlers: function() {
      this.checked();
      // this.listenTo(this.model, 'change:groups', this.render);
    },

    // отметим все группы, в которых учавствует контакт
    checked: function() {
      this.log('checked');
      // найдем все input[name="groups"]
      var $inputs = this.$el.find('input[name="groups"]');
      var groups = this.model.get('groups');
      // переберем все input
      _.each($inputs, function (input) {
        var value = $(input).attr('value');
        // вернет -1, если не найдеся в arr значения valur
        var index = _.indexOf(groups, value);
        // если value есть в model.groups, то checked
        if ( index > -1 )
          $(input).attr('checked','checked');
        else
          $(input).removeAttr('checked');
      });
    },

    // добавим новую группу
    addGroup: function (e) {
      e.preventDefault();
      // сохраним значение введеной группы
      // и сбросим поле input
      var $input = $('input[name=addGroup]');
      var group  = $input.val();
      // если пусто, то не добавим
      if ( !group ) return false;
      this.log('addGroup = ' + group);
      // обновим группы у модели
      this.model.addGroup(group);
      // добавим новую группу в groups коллекции
      var groupsC = this.model.get('groupsC');
      groupsC.push(group);
      groupsC.sort();
      this.render();
    },

    // переключение группы
    toggleGroup: function (e) {
      if ( e.target.nodeName == 'INPUT' ) {
        var group = $(e.target).siblings('h4').text();
        this.model.toggleGroup(group);
      };
      return this;
    },

    keyAction: function (e) {
      // спец. сочетание - не обрабатываем
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      // код нажатой клавиши
      var code = e.keyCode || e.which;
      // если enter, то сохраним группу
      if ( code === 13 ) {
        this.addGroup(e);
      };
      return this;
    },
  });
});
