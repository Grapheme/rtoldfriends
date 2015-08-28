var Game = {};

Game.init = function() {
  var t = this;
  t.tabs.show('start');

  $('.js-fb').on('click', function(){
    if($(this).hasClass('disabled')) return false;
    $(this).addClass('disabled');
    t.service = t.social.FB;
    t.service.init();
    return false;
  });

  $('.js-vk').on('click', function(){
    if($(this).hasClass('disabled')) return false;
    $(this).addClass('disabled');
    t.service = t.social.VK;
    t.service.init();
    return false;
  });

  $('.js-restart').on('click', function(){
    t.tabs.show('start');
    t.service.init();
    return false;
  });

  $('.js-share-link').each(function(){
    $(this).attr('href', $(this).attr('href') + window.location.href);
  });
};

Game.me = function(me){
  $('.result-holder .avatar-holder .avatar.js-face').css('background-image', 'url(' + me.photo + ')');
  $('.result-holder .user-name').text(me.first_name);
};