define([], function () {

  // Модель цвета бэкграунда пользователя
  return Backbone.Model.extend({

    colors: {
      0: '#ff386a',
      1: '#85bbeb',
      2: '#68c496',
      3: '#b34d1f',
      4: '#ffd16d',
      5: '#ffc55d',
      6: '#c34934',
      7: '#487093',
      8: '#ffd16d',
      9: '#ff690f',
      10: '#b6dbfb',
      11: '#4d1b02',
      12: '#ffa8bd',
    },

    // Инициализация
    initialize: function () {
      this.lenth = _.size(this.colors);
    },

    // Возвращает рандомный цвет
    rand: function () {
      return this.colors[_.random(this.lenth - 1)];
    },

    // Возвращает строковую интерпритацию
    toString: function () {
      return this.rand();
    }
  });
});
