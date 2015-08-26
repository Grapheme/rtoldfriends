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
            console.log('authorized', response);
            resolve(response);
          } else {
            console.log('not authorized');
            
            VK.Auth.login(function(response) { 
              if (response.session) { 
                resolve(response); 
              } else { 
                reject(respone);
              } 
            }); 
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
    _.extend(options, { version: 5.37 });

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

  getQuestions: function(data, callback) {
    var questionsArray = [];

    function profileToAnswer (profile) {
      return { 
        title: profile.first_name + ' ' + profile.last_name,
        image: profile.photo_big
      };
    }

    function textToAnswer(text) {
      return {
        title: text
      };
    }


    function updateQuestionText (questionText, profile) {
      questionText = questionText.replace('FRIEND_NAME', profile.first_name + ' ' + profile.last_name);
      // 
      return questionText;
    }


    questionsArray.push(deferred(function(resolve, reject) {


      function bdateToAnswer(bdate) {
        var b = bdate.split('.');
        b[1] = MONTH_NAMES[b[1]];
        return textToAnswer(b.join(' '));
      }

      var question = {
        text: "Ты помнишь, когда день рождения FRIEND_NAME?",
        type: "text",
        answers: []
      };       

      var friend = _.chain(data.friends)
        .filter(function(f) { return Boolean(f.bdate); })
        .sample()
        .value();

      var other = _.chain(data.friends)
        .filter(function(f) { return f.bdate && f.bdate != friend.bdate; })
        .pluck('bdate')
        .uniq()
        .map(bdateToAnswer)
        .sample(4)
        .value();

      console.log('sdsd', friend, other);

      question.text = updateQuestionText(question.text, friend);
      question.answers = _.shuffle([bdateToAnswer(friend.bdate)].concat(other));

      return resolve(question);
    }));

    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком университете учился FRIEND_NAME?",
        type: "text",
        answers: []
      };       

      var friend = _.chain(data.friends)
        .filter(function(f) { return f.universities && f.universities.length; })
        .sample()
        .value();

      var friendUnis = _.pluck(friend.universities, 'id');

      var otherUnis = _.chain(data.friends)
        .filter(function(f) { return f.universities && f.universities.length; })
        .pluck('universities')
        .flatten()
        .uniq(function(u) { return u.id; })
        .reject(function(u) { return _.include(friendUnis, u.id); })
        .sample(4)
        .map(function(u) { return { title: u.name }; })
        .value();

      question.text = updateQuestionText(question.text, friend);
      question.answers = _.shuffle([{ 
        title: friend.universities[0].name, 
        right: true 
      }].concat(otherUnis));

      return resolve(question);
    }));
    
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком городе родился FRIEND_NAME?",
        type: "text",
        answers: []
      };       

      $VK.api('users.get', { user_ids: _.pluck(data.friends, 'uid').join(','), fields: 'home_town' }).then(function(p) {
        // console.log('home home_town', _.pluck(p, 'home_town'));
      });

      // var friendsWithUniqHomeTown = _(data.friends)
      //   .uniq('home_town')
      //   // .filter(function(f) { return Boolean(f.home_town); })
      //   .value();

      return resolve();
    }));

    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком городе сейчас живет FRIEND_NAME?",
        type: "text",
        answers: []
      };       

      var friendsWithUniqCity = _(data.friends).uniq('city').filter(function(f) { return Boolean(f.city); }).value();
      if (!friendsWithUniqCity.length) return resolve();

      $VK.api('database.getCitiesById', { city_ids: _.pluck(friendsWithUniqCity, 'city').sort().join(',') }).then(function(friendCities) {
        
        function profileCityToAnswer (profile) {
          return {
            title: _.find(friendCities, { cid: profile.city }).name
          };
        }

        var rightAnswer;

        question.answers = _.shuffle([
          _.chain(friendsWithUniqCity)
            .sample()
            .tap(function(profile) { 
              rightAnswer = profile.city;
              question.text = updateQuestionText(question.text, profile); 
            })
            .thru(profileCityToAnswer)
            .extend({ right: true })
            .value()
        ].concat(
          _.chain(friendsWithUniqCity)
            .reject({ city: rightAnswer })
            .sample(4)
            .map(profileCityToAnswer)
            .value()
        ));

        resolve(question);
      });
    }));

    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "Кто из твоих друзей учился с тобой в одном университете?",
        type: "people",
        answers: []
      };
      
      if (!data.profile.universities.length) return resolve();
      var myUnis = _.map(data.profile.universities, 'id');

      var uniFriends = data.friends.filter(function (f) {
        return f.universities && f.universities.length && _.intersection(_.map(f.universities, 'id'), myUnis).length;
      });

      if (!uniFriends.length) return resolve();

      question.answers = _.shuffle([
        _.chain(uniFriends)
          .sample()
          .thru(profileToAnswer)
          .extend({ right: true })
          .value()
        ].concat(
          _.chain(data.friends)
            .difference(uniFriends)
            .sample(4)
            .map(profileToAnswer)
            .value()
        ));

        resolve(question);
    }));

    $.when.apply($, questionsArray).done(function() {
      callback(_.chain(arguments).compact().sample(5).value());
    });
  },

  init: function() {
    $VK.init({ appId: this.appId }).then(function(data) {
      
      var loadFriends = $VK.api('friends.get', { fields: 'photo_big,bdate,city,home_town,universities,schools' });
      var loadWall = $VK.api('wall.get', { ownder_id: data.mid, count: 100, filter: 'others' });
      // var loadPhotos = $VK.api();
      var loadProfile = $VK.api('users.get', { fields: 'photo_big,bdate,city,home_town,universities,schools' }).then(function(respone) {
        return respone[0];
      });

      var loadMe = $VK.api('users.get', { fields: 'photo_big' }).then(function(profiles) {
        Game.preloader.show([profiles[0].photo_big]);
        return profiles[0];
      });      

      var loadUniversities = $VK.api('database.getUniversities', {});
      loadUniversities = {};

      var loadCities = $VK.api('database.getCities', { country_id: 1, need_all: 0, count: 30 });
      loadCities = {};

      loadFriends.then(function(friends) {
        Game.preloader.show(_.map(friends, function(f) { return f.photo_big; }));
      });


      $.when(
        loadFriends, 
        loadWall, 
        loadProfile, 
        loadCities, 
        loadUniversities,
        loadMe
      ).then(function(friends, wall, profile, cities, universities, me) {
        var data = {
          friends: friends,
          wall:    wall,
          profile: profile,
          cities:   cities,
          universities: universities,
          me: me
        };

        

        this.getQuestions(data, function(questionsArray){
          console.log('questionsArray', questionsArray);
          Game.questions.init(questionsArray);
          Game.preloader.close();
        });
      }.bind(this));
    }.bind(this), function() {
      console.log('eror!!!', arguments);
    });
  }
};
