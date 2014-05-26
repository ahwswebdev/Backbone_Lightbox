(function (window, $, _, Backbone) {

  var LightboxView = Backbone.View.extend({

    tagName: 'div',

    attributes: {
      style: 'display: none;'
    },

    className: 'lightbox',

    options: {
      closeButton: true,
      closeButtonTitle: 'close',
      closeButtonText: 'close',
      centerVertically: true,
      scrollBody: true
    },

    renderOptions: null,

    template: null,

    content: '',

    scroll: {},

    _dfd: null,

    events: {
      'click': '_onElClicked',
      'click .lightbox-close': 'hide'
    },

    initialize: function (options) {

      // bind methods
      _.bindAll(this, '_centerVertically', '_onElClicked', '_keyup');

      // set initial options
      this.options = $.extend(this.options, options);

      // set template
      this._setTemplate();

      // add element to body
      $('body').append(this.$el);
    },

    _setTemplate: function () {
      var template = '<div class="lightbox-wrapper">' +
      '<% if (closeButton) { %> <button class="lightbox-close" title="<%= closeButtonTitle %>"><%= closeButtonText %></button> <% } %>' +
      '<div class="lightbox-content"></div>' +
      '</div>';
      this.template = _.template(template);
    },

    _cacheSelectors: function () {
      this.$content = this.$('.lightbox-content');
      this.$wrapper = this.$('.lightbox-wrapper');
    },

    _setListeners: function () {
      $(window).on('resize.lightbox', this._onResize);
      $(document).on('keyup.lightbox', this._keyup);
    },

    _removeListeners: function () {
      $(window).off('resize.lightbox');
      $(document).off('keyup.lightbox');
    },

    _setContent: function (content) {
      // Backbone view
      if (typeof content.render === 'function') {
        content.render();
        this._content = content.$el;
      }
      // jQuery object
      else if (content.jquery) {
        this._content = content;
      }
      // DOM string
      else if (typeof content === 'string') {
        this._content = $(content);
      }
      else {
        return false;
      }
      return true;
    },

    _setWidth: function (width) {
      this.$wrapper.css('width', width);
    },

    _resolvePromise: function () {
      if (this._dfd) {
        this._dfd.resolve();
        this._dfd = null;
      }
    },

    _setPromise: function () {
      this._resolvePromise();
      this._dfd = new jQuery.Deferred();
    },

    render: function (options) {


      this.$el.html(this.template(this.renderOptions));

      if (this.renderOptions.additionalClassName) {
        this.$el.addClass(this.renderOptions.additionalClassName);
      }
      this._cacheSelectors();
      this.$content.empty();
      this.$content.append(this._content);
      this._setListeners();
      return this;
    },

    show: function (content, options) {

      var width;

      // try to set content
      if (content) {
        if (!this._setContent(content)) {
          return false;
        }
      }

      // set render options
      this.renderOptions = $.extend(this.options, options);

      // render
      this.render(this.renderOptions);

      // set width
      if (options && options.width) {
        width = options.width;
      } else {
        width = this.options.width;
      }
      if (width) {
        this._setWidth(width);
      }

      // show
      this.$el.show();

      // center vertically
      if (this.renderOptions.centerVertically) {
        this._centerVertically();
      }

      // setBodyCss
      if (this.renderOptions.scrollBody) {
        this._scrollBody(this.renderOptions.scrollBody);
      }

      // promise handling
      this._setPromise();
      return this._dfd.promise();
    },

    hide: function () {
      this._removeListeners();
      this.$el.hide();
      this.$el.removeClass().addClass('lightbox');
      if (this.scroll.$elem) {
        this._unScrollBody();
      }
      this._resolvePromise();
      return this;
    },

    _onElClicked: function (event) {
      if ($(event.target).hasClass('lightbox')) {
        event.stopPropagation();
        this.hide();
      }
    },

    _keyup: function (event) {
      if (event.keyCode === 27) { // esc
        this.hide();
      }
    },

    _onResize: function (event) {
      if (this._centeredVertically) {
        this._centerVertically();
      }
    },

    _centerVertically: function () {
      this._centeredVertically = false;
      var windowHeight = $(window).height();
      var wrapperHeight = this.$wrapper.height();
      if (windowHeight > wrapperHeight) {
        this._centeredVertically = true;
        this.$wrapper.css('marginTop', Math.floor((windowHeight - wrapperHeight) / 2));
      }
    },

    _scrollBody: function ($elem) {

      var scrollTop;

      this.scroll = {};

      this.scroll.$elem = $elem.length ? $elem : $('body');
      this.scroll.scrollTop = $(window).scrollTop();
      this.scroll.position = this.scroll.$elem.css('position');
      this.scroll.marginTop = this.scroll.$elem.css('marginTop');

      this.scroll.$elem.css({position: 'fixed', marginTop: -this.scroll.scrollTop});
      window.scrollTo(0, 0);
   },

    _unScrollBody: function ($elem) {

      if (this.scroll.$elem.is(':hidden')) {
        this.scroll.$elem.show();
      }
      this.scroll.$elem.css({position: this.scroll.position, marginTop: this.scroll.marginTop});
      window.scrollTo(0, this.scroll.scrollTop);
    }
  });

  window.LightboxView = LightboxView;
}(window, jQuery, _, Backbone));
