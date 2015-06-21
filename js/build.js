({
  baseUrl: '.',
  name: 'main',
  out: 'main.js',
  optimize: 'uglify2',
  preserveLicenseComments: false,
  generateSourceMaps: true,
  paths: {
    'text'           : 'libs/text',
    'jquery'         : 'libs/jquery',
    'underscore'     : 'libs/underscore',
    'backbone'       : 'libs/backbone',
    'storage'        : 'libs/backbone.dualstorage.amd',
    'bootstrap-tw'   : 'libs/bootstrap.min',
    'datetimepicker' : 'libs/jquery.datetimepicker',
    'maskedinput'    : 'libs/jquery.maskedinput',
  }
})
