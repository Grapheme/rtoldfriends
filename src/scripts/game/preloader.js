Game.preloader = {
  faces: [],
  set: false,
  timeout: false,

  el: $('.preloader-holder'),

  show: function(photoUrls) {
    if (_.isString(photoUrls)) photoUrls = [photoUrls];

    var t = this;
    this.el.addClass('active-popup');
    $('.login-holder, .start-holder').removeClass('active-popup');
    if(photoUrls.length == 1) {
      this.el.find('.js-face').css('background-image', 'url(' + photoUrls[0] + ')');
    } else {
      this.faces = photoUrls;
      t.facesChange(0);
    }
  },

  facesChange: function(n) {
    var t = this;
    if(t.set === false) {
      $.each(t.faces, function(i, v){
        $('body').append('<img src="' + v + '" class="fixed-hidden" alt="">');
      });
      t.set = true;
    }

    this.el.find('.js-face').css('background-image', 'url(' + t.faces[n] + ')');
    t.timeout = setTimeout(function(){
      var nextN = n + 1;
      if(nextN == t.faces.length) {
        nextN = 0;
      }
      t.facesChange(nextN);
    }, 2000);
  },

  close: function() {
    var t = this;
    clearTimeout(t.timeout);
    this.el.removeClass('active-popup');
  }
};