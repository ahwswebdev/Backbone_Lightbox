describe('lightbox', function () {

  'use strict';

	beforeEach(function () {
		this.LightboxView = new LightboxView();
	});

	afterEach(function () {});

	it('is properly initialized and hidden', function () {
		expect(this.LightboxView.$el).toHaveClass('lightbox');
		expect(this.LightboxView.$el).toContain('.lightbox-wrapper');
		expect(this.LightboxView.$el).toContain('.lightbox-close');
		expect(this.LightboxView.$el).toContain('.lightbox-content');
		expect(this.LightboxView.$el).toBeHidden();
	});

  describe('show', function () {

    it('to parse Backbone View', function () {
      var $p = $('<p>', {'class': 'par'});
      var View = Backbone.View.extend({
        render: function () {
          this.$el.append($p);
        }
      });
      this.LightboxView.show(new View());
      expect(this.LightboxView.$content).toContain('p.par');
    });

    it('to parse jQuery object', function () {
      var content = $('<p>', {'class': 'par'});
      this.LightboxView.show(content);
      expect(this.LightboxView.$content).toContain('p.par');
    });

    it('to parse DOM Element', function () {
      var content = '<p class="par">text</p>';
      this.LightboxView.show(content);
      expect(this.LightboxView.$content).toContain('p.par');
    });

		it('hide to hide lightbox', function () {
			this.LightboxView.show('<p class="par">text</p>');
			expect(this.LightboxView.$el).not.toBeHidden();
			this.LightboxView.hide();
			expect(this.LightboxView.$el).toBeHidden();
		});
  });

  describe('width', function () {
    it('to have width auto', function () {
			this.LightboxView.show('<p class="par">text</p>');
      expect(this.LightboxView.$wrapper).not.toHaveCss('width');
    });

    it('to have width by default', function () {
      var lightboxView = new LightboxView({width: 400});
			lightboxView.show('<p class="par">text</p>');
      expect(lightboxView.$wrapper).toHaveCss({width: '400px'});
    });

    it('to have custom width', function () {
			this.LightboxView.show('<p class="par">text</p>', 400);
      expect(this.LightboxView.$wrapper).toHaveCss({width: '400px'});
    });

    it('to have custom width overriding default with', function () {
      var lightboxView = new LightboxView({width: 400});
			lightboxView.show('<p class="par">text</p>', 500);
      expect(lightboxView.$wrapper).toHaveCss({width: '500px'});
    });
  });
});
