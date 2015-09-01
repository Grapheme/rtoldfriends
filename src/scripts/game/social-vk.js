if (!Game.social) Game.social = {};

$VK = {

  scope: {
    friends: 2,
    photos: 4,
    wall: 8192
  },

  init: function (options) {
    if (!this.initialization) {
      this.limitedApiCall = rateLimit(3, VK.Api.call, VK.Api);

      console.log('init');
      VK.init({
        apiId: options.appId
      });

      this.initialization = deferred(function(resolve, reject) {
        // VK.Auth.getLoginStatus(function(response){
          // console.log('get login status');

          // if(response.session) {
            // console.log('authorized', response);
            // resolve(response);

          // } else {
            // console.log('not authorized');
            VK.Auth.login(function(response) { 
              if (response.session) { 
                resolve(response); 
              } else { 
                reject(respone);
              } 
            }, this.scope.friends + this.scope.photos); 
          // }
        // }.bind(this));
    
      }.bind(this));

    }
    
    return this.initialization;
  },



  api: function(method, options) {
    if (!options) options = {};
    _.extend(options, { version: 5.37 });

    return deferred(function(resolve, reject) { 
      this.limitedApiCall(method, options, function(data) {
        if (data.response) {
          resolve(data.response);
        } else {
          reject(data);
        }
      });
    }.bind(this));
  }
};







Game.social.VK = {
  appId: 5038810,
  // appId: 5048285,

  getQuestions: function(data, callback) {

    var friendIds = _.pluck(data.friends, 'uid');

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

    function logPostUrl (p) {
      console.log('post', p, 'https://vk.com/wall' + p.to_id + '_' + p.id);
    }


    function updateQuestionText (questionText, profile) {
      questionText = questionText.replace('FRIEND_NAME', profile.first_name + ' ' + profile.last_name);
      // 
      return questionText;
    }

    var right = { right: true };

    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "Кто из друзей оставил комментарий под твоей первой аватаркой?",
        type: "people",
        answers: []
      };       

      async.eachSeries(data.photos, function(p, callback) {

        if (p.comments && p.comments.count) {
          $VK.api('photos.getComments', { photo_id: p.pid, count: 100 }).then(function(comments) {
            comments.shift();
            var ids = _.pluck(comments, 'from_id');
            var friend = _.chain(data.friends)
              .filter(function(f) { return _.include(ids, f.uid); })
              .sample()
              .value();

            
            callback(friend || null);  
          });
        } else {
          callback(null);
        }
      }, function(msg) {
        if (!msg) {
          console.log('нет коментов от друзей под фотографиями');
          return resolve();
        }

        var friend = msg;
        var other = _.chain(data.friends)
          .reject(function(f) { return friend.uid == f.uid; })
          .sample(4)
          .map(profileToAnswer)
          .value();

        question.answers = _.shuffle([_.extend(profileToAnswer(friend), right)].concat(other));
        return resolve(question);
      });
      

      
    }, 10 * 1000));

    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "Кто из твоих друзей первый лайкнул твою запись на стене?",
        type: "people",
        answers: []
      };       


      var loadWall = $VK.api('wall.get', { ownder_id: data.mid, count: 100, filter: 'owner' }).then(function(data) {
        var count = data.shift();
        if (count < 100) {
          return data;
        } else {
          return $VK.api('wall.get', { ownder_id: data.mid, count: 100, filter: 'owner', offset: count-100 }).then(function(data) {
            data.shift();
            return data;
          });
        }
      }).then(function(posts) {
        
        var liked = _(posts)
          .sortBy('date')
          .filter(function(p) { return  p.likes && p.likes.count > 0; })
          .value();

        async.eachSeries(liked, function(p, callback) {
          $VK.api('likes.getList', { type: 'post', item_id: p.id }).then(function(likes) {
            if (likes.count && _.intersection(friendIds, likes.users).length) {
              p.likes = likes;
              // logPostUrl(p);
              callback(p);
            } else {
              callback(null);
            }
          });
        }, function(msg) {
          if (!msg) {
            console.log('нет лайков от друзей на стене');
            return resolve();
          }
          
          var friend = _.chain(data.friends)
            .filter(function(f) { return _.include(msg.likes.users, f.uid); })
            .sample()
            .thru(profileToAnswer)
            .value();

          var other = _.chain(data.friends)
            .reject(function(f) { return _.include(msg.likes.users, f.uid); })
            .sample(4)
            .map(profileToAnswer)
            .value();

          question.answers = _.shuffle([_.extend(friend, right)].concat(other));
          return resolve(question);
        });
      });
    }, 10 * 1000));

    var wallQuestion = function (options, callback) {
      var question = {
        text: options.text,
        type: "people",
        answers: []
      };
      
      var friend = _.chain(data.wall)
        .filter(function(p) { return _.include(friendIds, p.from_id); })
        .filter(options.filter)
        .sortBy('date')
        .first()
        // .tap(function(p) { p ? logPostUrl(p) : ''; })
        .thru(function(p) { return p ? _.find(data.friends, { uid: p.from_id }) : null; })
        .value();

      if (!friend) return callback();

      var other = _.chain(data.friends)
        .reject({ uid: friend.uid })
        .sample(4)
        .value();

      // question.text = updateQuestionText(question.text, friend);
      question.answers = _.shuffle([_.extend(profileToAnswer(friend), right)]
        .concat(_.map(other, profileToAnswer)));

      callback(question);
    };


    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      wallQuestion({
        text: "Кто из друзей первый поделился с тобой любимой песней?",
        filter: function(p) { 
          return p.attachments && p.attachments.length && _.chain(p.attachments).pluck('type').include('audio').value(); 
        }
      }, resolve);
    }, 10 * 1000));

    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      wallQuestion({
        text: "Кто из твоих друзей первый нарисовал тебе графити на стене?",
        filter: function(p) { 
          return p.attachments && p.attachments.length && _.chain(p.attachments).pluck('type').include('graffiti').value(); 
        }
      }, resolve);
    }, 10 * 1000));

    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      wallQuestion({
        text: "Кто из друзей поделился с тобой видео?",
        filter: function(p) { 
          return p.attachments && p.attachments.length && _.chain(p.attachments).pluck('type').include('video').value(); 
        }
      }, resolve);
    }, 10 * 1000));


    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      wallQuestion({
        text: "Кто из твоих друзей первым оставил запись на твоей стене?",
        filter: function(p) { return true; }
      }, resolve);
    }, 10 * 1000));


    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      function bdateToAnswer(bdate) {
        var b = _.map(bdate.split('.'), Number);
                
        var signsThisMonth = ZODIAK[b[1]];
        var sign = b[0] <= signsThisMonth[0] ? signsThisMonth[1] : signsThisMonth[2];

        var d = _.clone(b);
        d[1] = MONTH_NAMES[b[1] - 1];

        return {
          title: d.join(' '),
          image: '',
          zodiak: sign
        };
      }

      var question = {
        text: "Ты помнишь, когда родился твой друг FRIEND_NAME?",
        type: "zodiak",
        answers: []
      };       

      var friend = _.chain(data.friends)
        .filter(function(f) { return Boolean(f.bdate); })
        .sample()
        .value();

      var other = _.chain(data.friends)
        .filter(function(f) { return f.bdate && f.bdate != friend.bdate; })
        .pluck('bdate')
        // .tap(function(d) { console.log('bdate', d); })
        .uniq()
        .sample(4)
        .map(bdateToAnswer)
        .value();

      question.text = updateQuestionText(question.text, friend);
      question.answers = _.shuffle([_.extend(bdateToAnswer(friend.bdate), right)].concat(other));

      return resolve(question);
    }, 10 * 1000));

    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком университете учился твой друг FRIEND_NAME?",
        type: "university",
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
    }, 10 * 1000));
    
    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком городе родился твой друг FRIEND_NAME?",
        type: "city",
        answers: []
      };       

      $VK.api('users.get', { user_ids: _.pluck(data.friends, 'uid').join(','), fields: 'home_town' }).then(function(p) {
        // console.log('home home_town', _.pluck(p, 'home_town'));
      });

      // var friendsWithUniqHomeTown = _(data.friends)
      //   .uniq('home_town')
      //   // .filter(function(f) { return Boolean(f.home_town); })
      //   .value();


      // console.log('home_town не работает');
      return resolve();
    }, 10 * 1000));


    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "В каком городе сейчас живет FRIEND_NAME?",
        type: "city",
        answers: []
      };       

      var friendsWithUniqCity = _(data.friends).uniq('city').filter(function(f) { return Boolean(f.city); }).value();
      if (!friendsWithUniqCity.length) {
        console.log('нет друзей с городами');
        return resolve();
      }

      $VK.api('database.getCitiesById', { city_ids: _.pluck(friendsWithUniqCity, 'city').sort().join(',') }).then(function(friendCities) {
        
        function profileCityToAnswer (profile) {
          var name = _.find(friendCities, { cid: profile.city }).name;
          return {
            title: name,
            image: '/images/cities/' + name + '.jpg'
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
            .extend(right)
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
    }, 10 * 1000));

    //
    // QUESTION
    // 
    questionsArray.push(deferred(function(resolve, reject) {
      var question = {
        text: "Кто из твоих друзей учился с тобой в одном университете?",
        type: "people",
        answers: []
      };
      
      if (!data.me.universities.length) {
        console.log('не указан университет');
        return resolve();
      }
      var myUnis = _.map(data.me.universities, 'id');

      var uniFriends = data.friends.filter(function (f) {
        return f.universities && f.universities.length && _.intersection(_.map(f.universities, 'id'), myUnis).length;
      });

      if (!uniFriends.length) {
        console.log('нет друзей из университета');
        return resolve();
      }

      question.answers = _.shuffle([
        _.chain(uniFriends)
          .sample()
          .thru(profileToAnswer)
          .extend(right)
          .value()
        ].concat(
          _.chain(data.friends)
            .difference(uniFriends)
            .sample(4)
            .map(profileToAnswer)
            .value()
        ));

        resolve(question);
    }, 10 * 1000));

    $.when.apply($, questionsArray).done(function() {
      callback(_.chain(arguments).compact().value());
    });


  },

  loadData: function() {
    return $.whenKeys(this.load);
  },

  init: function() {
    if (!this.load) this.load = {};

    $VK.init({ appId: this.appId }).then(function(data) {
      
      if (!this.load.friends) {
        this.load.friends = $VK.api('friends.get', { fields: 'photo_big,bdate,city,home_town,universities,schools' }).then(function(data) {
          return _.reject(data, function(f) { return Boolean(f.deactivated); });
        });
      }

      this.load.friends.then(function(friends) {
        Game.preloader.show(_.map(friends, function(f) { return f.photo_big; }));
      });

      if (!this.load.me) {
        this.load.me = $VK.api('users.get', { fields: 'photo_big,bdate,city,home_town,universities,schools' }).then(function(profiles) { 
          return profiles[0];
        }); 
      }

      this.load.me.then(function(me) {
        Game.me({ photo: me.photo_big, first_name: me.first_name });
      });
             
      if (!this.load.otherWall) {
        this.load.otherWall = $VK.api('wall.get', { ownder_id: data.mid, count: 100, filter: 'others' }).then(function(data) {
          var count = data.shift();
          if (count < 100) {
            return data;
          } else {
            return $VK.api('wall.get', { ownder_id: data.mid, count: 100, filter: 'others', offset: count-100 }).then(function(data) {
              data.shift();
              return data;
            });
          }
        });
      }

      if (!this.load.photos) {
        this.load.photos = $VK.api('photos.get', { album_id: 'profile', rev: 0, extended: 1 });
      }
      
      this.loadData().then(function(data) {
        this.getQuestions(data, function(questionsArray){
          console.log('questionsArray', _.clone(questionsArray));
          Game.questions.init(questionsArray);
          Game.preloader.close();
        });
      }.bind(this));
      

    }.bind(this), function() {
      console.log('eror!!!', arguments);
    });
  }
};
