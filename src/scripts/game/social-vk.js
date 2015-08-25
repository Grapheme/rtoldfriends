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


    function updateQuestionText (questionText, profile) {
      questionText = questionText.replace('FRIEND_NAME', profile.first_name + ' ' + profile.last_name);
      return questionText;
    }



    // В каком университете учился XXX (имя фамилия друга)? friends

    // В каком городе родился XXX (имя фамилия друга)? friends

    // questionsArray.push(deferred(function(resolve, reject) {
    //   return resolve();
    // }));

    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком городе сейчас живет FRIEND_NAME?",
        type: "text",
        answers: []
      };       

      var friendsWithUniqCity = _(data.friends).uniq('city').filter(function(f) { return _.isNumber(f.city); }).value();
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
        ]
          .concat(
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
        loadUniversities
      ).then(function(friends, wall, profile, cities, universities) {
        var data = {
          friends: friends,
          wall:    wall,
          profile: profile,
          cities:   cities,
          universities: universities
        };

        this.getQuestions(data, function(questionsArray){
          console.log('questionsArray', questionsArray);
          Game.questions.init(questionsArray);
          Game.preloader.close();
        });
      }.bind(this));
    }.bind(this), function() {
      console.log('eror!!!', arguments)
    });
  }
};
