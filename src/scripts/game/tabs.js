Game.tabs = {
  show: function(name) {
    $('.js-game-tab[data-tab="' + name + '"]').show()
      .siblings().hide();
  }
};