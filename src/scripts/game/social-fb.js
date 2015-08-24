if (!Game.social) Game.social = {};

Game.social.FB = {
  appId: 1637810779822904,
  getQuestions: function(callback) {
    var questionsArray = Game.questionsSample;
    callback(questionsArray);
  },
  init: function() {
    var t = this;
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
      var settings = {
        appId: t.appId,
        version: 'v2.3'
      };
      FB.init(settings);
      FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          t.start(response);
        } else {
          var fb_perms = {scope: 'publish_actions, public_profile, user_birthday, user_photos, user_likes, user_friends'};
          FB.login(function(response) {
            t.start(response);
          }, fb_perms);
        }
      });
    });
  },
  start: function(data) {
    var t = this;
    Game.preloader.show('http://graph.facebook.com/' + data.authResponse.userID + '/picture?width=160&height=160');
    t.getQuestions(function(questionsArray){
      Game.questions.init(questionsArray);
      Game.preloader.close();
    });
    FB.api('/me', function(response) {
      if(response) {
        $('.js-your-name').text(response.name.split(' ')[0]);
      }
    });
  }  
};