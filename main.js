var Game = {};
Game.tabs = {
  show: function(name) {
    $('.js-game-tab[data-tab="' + name + '"]').show()
      .siblings().hide();
  }
};
Game.preloader = {
  faces: [],
  show: function(url) {
    $('.preloader-holder').addClass('active-popup');
    $('.login-holder').removeClass('active-popup');
    $('.js-face').css('background-image', 'url(' + url + ')');
    //this.facesChange(0);
  },
  facesChange: function(n) {
    var t = this;
    $('.js-face').css('background-image', faces[n]);
    setTimeout(function(){
      var nextN = n++;
      if(nextN == t.faces.length) {
        nextN = 0;
      }
      t.facesChange(nextN);
    }, 2000);
  },
  close: function() {
    $('.preloader-holder').removeClass('active-popup');
  }
};
Game.questions = {
  qArray: [],
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
    t.qArray = array;
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
    questions: [
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
    ],
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
      setTimeout(function(){
        Game.questions.init(t.questions);
      }, 2000);
      FB.api('/me', function (response) {
        if(response) {
          $('.js-your-name').text(response.name.split(' ')[0]);
        }
      });
    }
  },
  VK: {
    init: function() {

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