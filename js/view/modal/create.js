define(function (require) {

  var template = require('text!templates/modal/create.html');
  var Modal = require('view/modal/modal');
  var datetimepicker = require('datetimepicker');

  // Представление пользователя
  return Modal.extend({

    name: 'create',

    template: _.template(template),

    events: {
      'click button[name="back"]' : 'back',
      'click button[name="update"]' : 'updateContact',

      'click a[href$="avatar"]' : 'modalAvatar',
      'click a[href$="location"]' : 'modalLocation',
      'click a[href$="group"]' : 'modalGroup',

      'click button[name=delete]' : 'deleteInput',
      'click button[name=clean]' : 'cleanInput',
      'click a[href$="location"] button[name="clean"]' : 'cleanInputLocation',
      'click button[name=clone]' : 'cloneInput',

      'blur input' : 'blurInput',
    },

    // навесим события на поля
    handlers: function () {
      // навешивает обработчик ввода даты
      var $inputDate = this.$el.find('input[type="date"]');
      this.dateHandler( $inputDate );
      // навешиваем обработчик ввода телефона
      var $inputPhone = this.$el.find('input[type="tel"]');
      this.telHandler( $inputPhone );
    },

    // настрим модуль jQuery для ввода даты
    // http://xdsoft.net/jqplugins/datetimepicker/
    dateHandler: function ($input) {
      $input.datetimepicker({
        lang:'ru',
        timepicker:false,
        format:'Y-m-d',
        // mask:true,
        closeOnDateSelect: 0,
        defaultDate:new Date(),
        dayOfWeekStart: 1,
        theme: 'dark',
      });
    },

    // http://digitalbush.com/projects/masked-input-plugin/
    // маска для поля с телефоном
    telHandler: function ($input) {
      $input.keyup(function () {
        if (this.value != this.value.replace(/[^-0-9\s+()\.]/g, '')) {
           this.value = this.value.replace(/[^-0-9\s+()\.]/g, '');
        }
      });
    },

    updateContact: function (e) {
      // обновим модель в коллекции
      if (this.model.isNew()) {
        this.collection.create(this.model, {wait: true});
      } else {
        this.collection.add(this.model);
        this.model.save();
      };
      this.back();
    },

    // модальное окно для аватарок
    modalAvatar: function (e) {
      e.preventDefault();
      this.close();
      this.vent.publish('modal:avatar', this.model);
    },

    // модальное окно для локации
    modalLocation: function (e) {
      e.preventDefault();
      this.close();
      this.vent.publish('modal:cites', this.model);
    },

    // модальное окно для выбора группы
    modalGroup: function(e) {
      e.preventDefault();
      this.close();
      this.vent.publish('modal:group', this.model);
    },

    // удалим блок с button[name=delete]
    deleteInput: function (e) {
      // очистим инпут и сохраним в model
      this.cleanInput(e);
      // запомним выбранный input
      var $button = $(e.target);
      // найдем содержащий его контейнер
      var $block = $button.closest('.input-group');
      // имя атрибута input
      var name = $block.find('input').attr('name');
      // количество input[name="name"]
      var input = 'input[name="' + name + '"]';
      var count = this.$el.find(input).length;

      // если остался последний элемент,
      // тогда просто очистим его содержимое
      if ( count == 1 ) {
        this.cleanInput(e);
      } else {
        // или удалим весь блок
        $block.remove();
      }

      return this;
    },

    // очистим блок с button[name=clean]
    cleanInput: function (e) {
      // запомним выбранный input
      var $button = $(e.target);
      // найдем соседний инпут
      var $input = $button.parent().siblings('input');
      // удалим из модели значение
      var name = $input.attr('name');
      var value = $input.val();
      // очистим значение в модели
      this.model.cleanValue(name, value);
      // очистим значение в поле input
      $input.val('');
      return this;
    },

    cleanInputLocation: function (e) {
      e.preventDefault();
      e.stopPropagation();
      alert('cleanInputLocation');
    },

    // добавим еще поле с input
    cloneInput: function (e) {
      $button = $(e.target);
      // клонируем первый верхний элемент
      $clone = $button
        .prevAll('.input-group:first')
        .clone(false);
      // поменяем name, что бы можно было удалить
      // при нажатии на x
      $clone.find('button').attr('name','delete');
      var $input = $clone.find('input');
      $input.val('');
      // и вставим его перед кнопкой
      $clone.insertBefore($button);
      // навесим обработчики
      var type = $input.attr('type');
      if ( type == 'tel' ) { this.telHandler( $input ) };
      return this;
    },

    // как только blure input,
    // сохраним значение в моделе
    blurInput: function (e) {
      var name  = $(e.target).attr('name');
      var value = $(e.target).val();
      if ( !!value ) this.model.setValue(name, value);
      return false;
    },
  });
});
