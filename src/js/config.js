// подгрузим конфиг
requirejs.config({

  baseUrl: 'js',

  //  псевдонимы и пути используемых библиотек и плагинов
  paths: {
    'text'           : 'vendor/text',
    'jquery'         : 'vendor/jquery',
    'underscore'     : 'vendor/underscore',
    'backbone'       : 'vendor/backbone',
    'storage'        : 'vendor/backbone.localStorage',
    'modal'          : 'vendor/bootstrap/modal',
    'datetimepicker' : 'vendor/jquery.datetimepicker',
  },

  shim: {
    'underscore' : {
      exports: '_'
    },
    'backbone' : {
      deps: ['underscore','jquery'],
      exports: 'Backbone'
    },
    'storage' : {
      deps: ['backbone'],
    },
    'bootstrap-tw': {
      deps: ['jquery'],
    },
    'datetimepicker' : {
      deps: ['jquery'],
    },
    'maskedinput' : {
      deps: ['jquery'],
    },

   'libs/app' : {
      // deps: ['backbone', 'storage'],
      deps: ['backbone'],
    },
  },
})
