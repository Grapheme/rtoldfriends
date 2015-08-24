if (!Game.social) Game.social = {};

$VK = {
  init: function (options) {
    return deferred(function(resolve, reject) {
      window.vkAsyncInit = function() {
        VK.init({
          apiId: options.appId
        });
        VK.Auth.getLoginStatus(function(response){
          if(response.session) {
            resolve(response);
          } else {
            console.log('not auth');
            reject(response);
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
    });
  },

  api: function(method, options) {
    if (!options) options = {};
    return deferred(function(resolve, reject) {
      VK.Api.call(method, options, function(data) {
        if (data.response) {
          resolve(data.response);
        } else {
          reject(data);
        }
      });
    });
  }
};


Game.social.VK = {
  appId: 5038810,

  getQuestions: function(callback) {
    // 
    // var questionsArray = Game.questionsSample;
    // callback(questionsArray);
  },

  init: function() {

    $VK.init({ appId: this.appId }).then(function(data) {

       // день рождения  
       // университете
       // город родился
       // городе сейчас живет
       // учился с тобой в одном университете
       // photo_big

      var friendsReq = $VK.api('friends.get', { fields: 'bdate, city, education, contacts, universities' });
      // var wallReq = $VK.api();
      // var photosReq = $VK.api();
      // var profileReq = $VK.api();


      friendsReq.then(function(friends) {
        console.log('sdsd', friends);
        Game.preloader.show(_.map(friends, function(f) { return f.photo_big; }));
      });

      // $.when(friends, posts, photos, profile).then(function(friends, posts, photos) {


      // });
        

      this.getQuestions(function(questionsArray){
        Game.questions.init(questionsArray);
        Game.preloader.close();
      });
    }.bind(this));
  }
};
