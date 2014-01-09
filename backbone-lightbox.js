(function (window, $, _, Backbone) {

	var LightboxView = Backbone.View.extend({

		tagName: 'div',
		className: 'lightbox',
    options: {},
		content: '',

		// events
		events: {
			'click .lightbox-close': 'hide',
		},

		initialize: function (options) {
      if (options && options.width) {
        this.width = options.width;
      }
			this.$el.html('<div class="lightbox-wrapper"><div class="lightbox-close">X</div><div class="lightbox-content"></div></div>');
			$('body').append(this.$el);
      this.hide();
			this._setLocalScope();
      this._setListeners();
		},

    _setLocalScope: function () {
			this.$content = this.$el.find('.lightbox-content');
			this.$wrapper = this.$el.find('.lightbox-wrapper');
    },

    _setListeners: function () {
      _.bindAll(this, '_centerVertically', '_onElClicked', '_keyup');
      $(window).on('resize', this._centerVertically);
			this.$el.click(this._onElClicked);
			$(document).keyup(this._keyup);
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

		render: function () {
			this.$content.empty();
			this.$content.append(this._content);
			return this;
		},

		show: function (content, width) {
			// try to set content
			if (content) {
				if (!this._setContent(content)) {
					return false;
				}
			}
      // set width
      width = width || this.width;
      if (width) {
        this._setWidth(width);
      }
			// show content
			this.render();
			this.$el.show();
      this._centerVertically();
			return this;
		},

		hide: function () {
			this.$el.hide();
			return this;
		},

		_onElClicked: function (e) {
			if ($(e.target).hasClass('lightbox')) {
				this.hide();
			}
		},

		_keyup: function (e) {
			if (e.keyCode === 27) { // esc
				this.hide();
			}
		},

    _centerVertically: function () {
      var windowHeight = $(window).height();
      var wrapperHeight = this.$wrapper.height();
      if (windowHeight > wrapperHeight) {
        this.$wrapper.css('marginTop', Math.floor((windowHeight - wrapperHeight) / 2));
      }
    }
	});

	window.LightboxView = LightboxView;
})(window, jQuery, _, Backbone);
