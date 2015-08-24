Game.preloader = {
  faces: [],
  set: false,
  timeout: false,
  show: function(photoUrls) {
    if (_.isString(photoUrls)) photoUrls = [photoUrls];

    var t = this;
    $('.preloader-holder').addClass('active-popup');
    $('.login-holder').removeClass('active-popup');
    if(photoUrls.length == 1) {
      $('.js-face').css('background-image', 'url(' + photoUrls[0] + ')');
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
    $('.js-face').css('background-image', 'url(' + t.faces[n] + ')');
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
    $('.preloader-holder').removeClass('active-popup');
  }
};