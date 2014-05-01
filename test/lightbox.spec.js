describe('lightbox', function () {

  'use strict';

  beforeEach(function () {
    this.LightboxView = new LightboxView();
  });

  afterEach(function () {
    this.LightboxView.remove();
  });

  it('is properly initialized and hidden', function () {
    expect(this.LightboxView.$el).toHaveClass('lightbox');
    expect(this.LightboxView.$el).toContain('.lightbox-wrapper');
    expect(this.LightboxView.$el).toContain('.lightbox-close');
    expect(this.LightboxView.$el).toContain('.lightbox-content');
    expect(this.LightboxView.$el).toBeHidden();
  });

  describe('options init', function () {

    it('default', function () {
      expect(this.LightboxView.options.closeButtonTitle).toBe('close');
    });

    it('closeButtonTitle', function () {
      var lightboxView = new LightboxView({closeButtonTitle: 'sluit'});
      expect(lightboxView.$el.html()).toContain('sluit');
    });

    it('additional className', function () {
      var lightboxView = new LightboxView({additionalClassName: 'location-class'});
      expect(lightboxView.$el).toHaveClass('location-class');
    });
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
      this.LightboxView.show('<p class="par">text</p>', {width: 400});
      expect(this.LightboxView.$wrapper).toHaveCss({width: '400px'});
    });

    it('to have custom width overriding default with', function () {
      var lightboxView = new LightboxView({width: 400});
      lightboxView.show('<p class="par">text</p>', {width: 500});
      expect(lightboxView.$wrapper).toHaveCss({width: '500px'});
    });
  });

  describe('promise', function () {
    it('to return promise', function () {
      var ret = this.LightboxView.show('<p class="par">text</p>');
      expect(typeof ret.then).toBe('function');
    });

    it('to resolve on hide', function () {
      var spy = jasmine.createSpy('spy')
      $.when(this.LightboxView.show('<p class="par">text</p>')).then(spy);
      this.LightboxView.hide();
      expect(spy).toHaveBeenCalled();
    });

    it('to resolve on sequential show calls', function () {
      var spy = jasmine.createSpy('spy')
      $.when(this.LightboxView.show('<p class="par">text</p>')).then(spy);
      this.LightboxView.show('<p>par 2</p>');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('closeButton', function () {

    it('to have closeButton as default', function () {
      this.LightboxView.show('<p class="par">text</p>');
      expect(this.LightboxView.$el).toContain('.lightbox-close');
    });

    it('to not have closeButton', function () {
      this.LightboxView = new LightboxView({closeButton: false});
      this.LightboxView.show('<p class="par">text</p>');
      expect(this.LightboxView.$el).not.toContain('.lightbox-close');
    });

    it('to not have closeButton on show', function () {
      this.LightboxView.show('<p>text</p>', {closeButton: false});
      expect(this.LightboxView.$el).not.toContain('.lightbox-close');
    });
  });

  describe('additionalClassName', function () {

    it('default', function () {
      this.LightboxView = new LightboxView({additionalClassName: 'location-class'});
      expect(this.LightboxView.$el).toHaveClass('location-class');
    });

    it('on show', function () {
      this.LightboxView.show('<p>text</p>', {additionalClassName: 'location-class'});
      expect(this.LightboxView.$el).toHaveClass('location-class');
    });
  });

  describe('centerVertically', function () {

    it('to centerVertically as default', function () {

      var spy = spyOn(this.LightboxView, '_centerVertically').andCallThrough();
      this.LightboxView.show('<p class="par">text</p>');
      expect(spy).toHaveBeenCalled();
      expect(spy.callCount).toBe(1);
      this.LightboxView._onResize();
      expect(spy.callCount).toBe(2);
    });

    it('to not centerVertically', function () {

      var spy;
      this.LightboxView = new LightboxView({centerVertically: false});
      spy = spyOn(this.LightboxView, '_centerVertically').andCallThrough();
      this.LightboxView.show('<p class="par">text</p>');
      expect(spy).not.toHaveBeenCalled();
      this.LightboxView._onResize();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
