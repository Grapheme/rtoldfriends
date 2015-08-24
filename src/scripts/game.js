var Game = {};

Game.init = function() {
  var t = this;
  t.tabs.show('start');
  $('.js-fb').on('click', function(){
    if($(this).hasClass('disabled')) return false;
    $(this).addClass('disabled');
    t.socials.FB.init();
    return false;
  });
  $('.js-vk').on('click', function(){
    if($(this).hasClass('disabled')) return false;
    $(this).addClass('disabled');
    t.socials.VK.init();
    return false;
  });
  $('.js-restart').on('click', function(){
    t.questions.restart();
    return false;
  });
  $('.js-share-link').each(function(){
    $(this).attr('href', $(this).attr('href') + window.location.href);
  });
};
