module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore.js',
      'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone.js',
      'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      'backbone.lightbox.js',
      'test/*.spec.js'
    ],
    autoWatch: true,
    browsers: ['PhantomJS']
  });
};
