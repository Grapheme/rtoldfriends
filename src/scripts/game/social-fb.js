if (!Game.social) Game.social = {};

$FB = {
  init: function (options) {
    return deferred(function (resolve) {
      $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        var settings = {
          appId: options.appId,
          version: 'v2.3'
        };

        FB.init(settings);
        FB.getLoginStatus(function(response) {
          if (response.status == 'connected') {
            resolve(response);
          } else {
            var fb_perms = {scope: 'publish_actions, public_profile, user_birthday, user_photos, user_likes, user_friends'};
            FB.login(function(response) {
              resolve(response);
            }, fb_perms);
          }
        });
      });
    });
  },

  api: function(path, method, params) {
    if (!params) params = {};
    return deferred(function(resolve) {
      FB.api(path, method, params, resolve);
    });
  }
};


Game.social.FB = {
  appId: 1637810779822904,
  getQuestions: function(callback) {
    var questionsArray = Game.questionsSample;
    callback(questionsArray);
  },
  init: function() {

    $FB.init({ appId: this.appId }).then(function(data) {
      // FB.api('/me', function(response) {
      //   if(response) {
      //     $('.js-your-name').text(response.name.split(' ')[0]);
      //   }
      // });

      // $FB.api('/me/taggable_friends', 'get').then(function(response) {
      //   console.log('friends', response)
      // });

      console.log('sdsd',data );

      // $.getJSON('http://localhost:4567/' + data.authResponse.userID).then(function(data) {
        // console.log('friends?', data)
      // });

      $.getJSON('https://graph.facebook.com/' +  data.authResponse.userID).then(function(data) {
        console.log('dd', data);
      });

      $FB.api('/me').then(function(data) {
        console.log('sasd', data);
      });

      Game.me({ photo: 'http://graph.facebook.com/' + data.authResponse.userID + '/picture?width=160&height=160' });
      t.getQuestions(function(questionsArray){
        Game.questions.init(questionsArray);
        Game.preloader.close();
      });
    });
  }
};