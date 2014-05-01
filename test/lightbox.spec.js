describe('lightbox', function () {

  'use strict';

  beforeEach(function () {
    this.LightboxView = new LightboxView();
  });

  afterEach(function () {
    this.LightboxView.remove();
  });

  describe('rendering', function () {

    it('is properly initialized and hidden', function () {
      expect(this.LightboxView.$el).toHaveClass('lightbox');
      expect(this.LightboxView.$el).toBeHidden();
    });


    it('has layout elements rendered', function () {
      this.LightboxView.show();
      expect(this.LightboxView.$el).toContain('.lightbox-wrapper');
      expect(this.LightboxView.$el).toContain('.lightbox-close');
      expect(this.LightboxView.$el).toContain('.lightbox-content');
    });
  });

  describe('options init', function () {

    it('default', function () {
      expect(this.LightboxView.options.closeButton).toBe(true);
      expect(this.LightboxView.options.closeButtonTitle).toBe('close');
      expect(this.LightboxView.options.closeButtonText).toBe('close');
      expect(this.LightboxView.options.centerVertically).toBe(true);
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

    it('closeButtonTitle', function () {
      var lightboxView = new LightboxView({closeButton: true, closeButtonTitle: 'close me'});
      lightboxView.show();
      expect(lightboxView.$el.html()).toContain('close me');
    });

    it('closeButtonText', function () {
      var lightboxView = new LightboxView({closeButton: true, closeButtonText: 'close me text'});
      lightboxView.show();
      expect(lightboxView.$el.html()).toContain('close me text');
    });

  });

  describe('additionalClassName', function () {

    it('default', function () {
      this.LightboxView = new LightboxView({additionalClassName: 'location-class'});
      this.LightboxView.show();
      expect(this.LightboxView.$el).toHaveClass('location-class');
    });

    it('on show', function () {
      this.LightboxView.show('<p>text</p>', {additionalClassName: 'location-class'});
      expect(this.LightboxView.$el).toHaveClass('location-class');
    });

    it('to be removed on hide', function () {
      this.LightboxView.show('<p>text</p>', {additionalClassName: 'location-class'});
      this.LightboxView.hide();
      expect(this.LightboxView.$el).not.toHaveClass('location-class');
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

  describe('scroll body', function () {

    it('body to have CSS set and window to be scrolled', function () {

      var position, marginTop;
      position = $('body').css('position');
      marginTop = $('body').css('marginTop');

      this.LightboxView.show('<p class="par">text</p>');
      expect($('body')).toHaveCss({position: 'fixed'});
      this.LightboxView.hide();
      expect($('body')).toHaveCss({position: position, 'margin-top': marginTop});
    });

    it('body to not have CSS set', function () {

      $('body').css('position', 'relative');
      this.LightboxView.show('<p class="par">text</p>', {scrollBody: false});
      expect($('body')).not.toHaveCss({position: 'fixed'});
    });

    it('elem to have CSS set and window to be scrolled', function () {

      var position, marginTop, $bodyContainer;

      $bodyContainer = $('<div></div>', {'class': 'body-container'});

      $('body').append($bodyContainer);

      position = $bodyContainer.css('position');
      marginTop = $bodyContainer.css('marginTop');

      this.LightboxView.show('<p class="par">text</p>', {scrollBody: $bodyContainer});
      expect($bodyContainer).toHaveCss({position: 'fixed'});
      this.LightboxView.hide();
      expect($bodyContainer).toHaveCss({position: position, 'margin-top': marginTop});
    });
  });
});
