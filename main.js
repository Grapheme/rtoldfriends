function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var Game = {};
// Fake questions bellow
Game.questionsSample = [
  {
    text: 'Кто первым из друзей оценил твою первую аватарку?',
    type: 'people',
    answers: [
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Иванова'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Синдицкая'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Самойлик'
      },
      {
        right: true,
        image: './src/face-1.png',
        title: 'Игорь Иванов'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Кирилл Андреевич'
      }
    ]
  },
  {
    text: 'Кто первым оставил комментарий у тебя на стене в профиле?',
    type: 'people',
    answers: [
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Иванова'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Синдицкая'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Самойлик'
      },
      {
        right: true,
        image: './src/face-1.png',
        title: 'Игорь Иванов'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Кирилл Андреевич'
      }
    ]
  },
  {
    text: 'Кто первым оставил комментарий у тебя на стене в профиле?',
    type: 'people',
    answers: [
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Иванова'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Синдицкая'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Самойлик'
      },
      {
        right: true,
        image: './src/face-1.png',
        title: 'Игорь Иванов'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Кирилл Андреевич'
      }
    ]
  },
  {
    text: 'Кто первым оставил комментарий у тебя на стене в профиле?',
    type: 'people',
    answers: [
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Иванова'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Синдицкая'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Самойлик'
      },
      {
        right: true,
        image: './src/face-1.png',
        title: 'Игорь Иванов'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Кирилл Андреевич'
      }
    ]
  },
  {
    text: 'Кто первым оставил комментарий у тебя на стене в профиле?',
    type: 'people',
    answers: [
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Иванова'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Синдицкая'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Анастасия Самойлик'
      },
      {
        right: true,
        image: './src/face-1.png',
        title: 'Игорь Иванов'
      },
      {
        right: false,
        image: './src/face-1.png',
        title: 'Кирилл Андреевич'
      }
    ]
  }
];
Game.tabs = {
  show: function(name) {
    $('.js-game-tab[data-tab="' + name + '"]').show()
      .siblings().hide();
  }
};
Game.preloader = {
  faces: [],
  set: false,
  timeout: false,
  show: function(url) {
    var t = this;
    $('.preloader-holder').addClass('active-popup');
    $('.login-holder').removeClass('active-popup');
    if(url) {
      $('.js-face').css('background-image', 'url(' + url + ')');
    } else {
      t.facesChange(0);
    }
  },
  facesChange: function(n) {
    var t = this;
    if(t.set === false) {
      $.each(t.faces, function(i, v){
        $('body').append('<img src="' + v + '" class="fixed-hidden" alt="">');
      });
      t.set = true;
    }
    $('.js-face').css('background-image', 'url(' + t.faces[n] + ')');
    t.timeout = setTimeout(function(){
      var nextN = n + 1;
      if(nextN == t.faces.length) {
        nextN = 0;
      }
      t.facesChange(nextN);
    }, 2000);
  },
  close: function() {
    var t = this;
    clearTimeout(t.timeout);
    $('.preloader-holder').removeClass('active-popup');
  }
};
Game.questions = {
  qArray: [],
  fullArray: [],
  activeIndex: false,
  rightCount: 0,
  status: false,
  setQuestion: function(n) {
    var t = this;
    var thisObj = t.qArray[n];
    t.activeIndex = n;
    t.status = 'set';
    $('.js-qNumber').text(n+1);
    $('.js-qLength').text(t.qArray.length);
    $('.js-qText').html(thisObj.text);
    $('.js-qAnswer')
      .removeClass('choice-fail choice-success')
      .each(function(){
        var thisAnswer = thisObj.answers[$(this).index()];
        $(this).find('.js-qaImage').css('background-image', 'url(' + thisAnswer.image + ')');
        $(this).find('.js-qaTitle').text(thisAnswer.title);
      });
    $('.js-qStatus, .js-qNext').hide();
  },
  answer: function(index) {
    var t = this;
    var question = t.qArray[t.activeIndex];
    var right;
    t.status = 'answered';
    $.each(question.answers, function(i, v){
      if(v.right === true) {
        right = i;
      }
    });
    if(index == right) {
      t.rightCount++;
      $('.js-qStatus[data-status="true"]').show();
      $('.js-qAnswer').eq(right).addClass('choice-success');
    } else {
      $('.js-qStatus[data-status="lie"]').show();
      $('.js-qAnswer').eq(index).addClass('choice-fail');
    }
    if(t.qArray[t.activeIndex+1]) {
      $('html, body').animate({scrollTop: $(document).height()});
      $('.js-qNext').slideDown();
    } else {
      t.finish();
    }
  },
  finish: function() {
    var t = this;
    t.status = 'finish';
    if(t.rightCount < 3) {
      $('[data-finish="bad"]').show()
        .siblings().hide();
    } else {
      $('[data-finish="good"]').show()
        .siblings().hide();
    }
    Game.tabs.show('finish');
  },
  init: function(array) {
    var t = this;
    t.fullArray = array;
    for(var i = 0; i < 3; i++) {
      var thisNumber = randomInt(0, array.length - 1)
      t.qArray.push(array[thisNumber]);
      delete array[thisNumber];
      var reCount = [];
      $.each(array, function(i, v){
        if(v !== undefined) {
          reCount.push(v);
        }
      });
      array = reCount;
    }
    t.setQuestion(0);
    Game.tabs.show('question');
    $('.js-qAnswer').on('click', function(){
      if(t.status == 'set') {
        t.answer($(this).index());
      }
      return false;
    });
    $('.js-qNext').on('click', function(){
      $('html, body').animate({ scrollTop: 0 });
      t.setQuestion(t.activeIndex+1);
      return false;
    });
  },
  restart: function() {
    var t = this;
    t.rightCount = 0;
    t.setQuestion(0);
    Game.tabs.show('question');
  }
}
Game.socials = {
  FB: {
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
        }
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
  },
  VK: {
    appId: 5038810,
    getQuestions: function(callback) {
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
  }
};
Game.init = function() {
  var t = Game;
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
}
$(Game.init)