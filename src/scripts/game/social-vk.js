if (!Game.social) Game.social = {};

Game.social.VK = {
  appId: 5038810,
  getQuestions: function(callback) {
    // 
    
    var questionsArray = Game.questionsSample;
    callback(questionsArray);
  },
  init: function() {
    var t = this;
    window.vkAsyncInit = function() {
      VK.init({
        apiId: t.appId
      });
      VK.Auth.getLoginStatus(function(response){
        if(response.session) {
          t.start(response);
        } else {
          console.log('not auth');
        }
      });
    };
    setTimeout(function() {
      var el = document.createElement("script");
      el.type = "text/javascript";
      el.src = "http://vk.com/js/api/openapi.js";
      el.async = true;
      document.getElementById("vk_api_transport").appendChild(el);
    }, 0);
  },
  start: function(response) {
    var t = this;
    VK.Api.call('photos.get', {owner_id: response.session.mid, album_id: 'profile', rev: 1, extended: 1, count: 1}, function(r) {
      Game.preloader.show(r.response[0].src);
    });
    VK.Api.call('friends.get', {album_id: 'profile', count: 10, offset: 100, fields: ['photo_big']}, function(r) {
      
      $.each(r.response, function(i, v){
        Game.preloader.faces.push(v.photo_big);
      });

      Game.preloader.show();

      t.getQuestions(function(questionsArray){
        Game.questions.init(questionsArray);
        Game.preloader.close();
      });
    });
  }
};
