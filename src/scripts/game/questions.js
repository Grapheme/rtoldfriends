Game.questions = {
  qArray: [],

  activeIndex: false,
  rightCount: 0,
  status: false,
  setQuestion: function(n) {
    var t = this;
    var question = t.qArray[n];
    t.activeIndex = n;
    t.status = 'set';
    $('.js-qNumber').text(n+1);
    $('.js-qLength').text(t.qArray.length);
    $('.js-qText').html(question.text);
    $('.js-qAnswer')
      .removeClass('choice-fail choice-success right')
      .each(function(key, val){
        var text = $(this).find('.js-qaTitle');
        text.text('');

        var img = $(this).find('.js-qaImage');
        img
          .removeClass('city university people zodiak')
          // .removeClass('bliznecy deva kozerog lev oven rak riby skorpion strelec telec vesy vodoley')
          .css('background-image', ''); 
        
                
        var answer = question.answers[$(this).index()];
        if (!answer) return;
                
        text.text(answer.title);
        img.addClass(question.type);
        
        var images = [];
        if (question.type == 'text') {
          
        } else if (question.type == 'people') {
          
        } else if (question.type == 'city') {
          images.push('url("img/city.svg")');

        } else if (question.type == 'university') {

          images.push('url("img/university_' + (key + 1) + '.svg")');          

        } else if (question.type == 'zodiak') {
          images.push('url("img/'+ answer.zodiak + '.svg")');            
        }

        if (answer.image) {
          images.push('url("' + answer.image + '")');
        }

        img.css('background-image', images.reverse().join(',')); 
      });
      

    $('.js-qNext').text(n == t.qArray.length - 1 ? 'Узнать результат' : 'Следующий вопрос');

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
      $('.js-qAnswer').eq(right).addClass('right'); 
    }
    
    $('html, body').animate({scrollTop: $(document).height()});
    $('.js-qNext').show();
  },

  win: function(right, all) {
    return Math.round(right / all * 100) > 60;
  },

  finish: function() {
    var t = this;
    t.status = 'finish';

    var win = t.win(t.rightCount, t.qArray.length);

    if(win) {
      $('[data-finish="good"]').show()
        .siblings().hide();
    } else {
      $('[data-finish="bad"]').show()
        .siblings().hide();
    }

    $('.result-holder .test-result span').text(t.rightCount + ' из ' + t.qArray.length);


    var share = {
      url: window.location.href,
      image: 'http://xn--80aacelbfkfsd1b9b3bxh.xn--p1ai/images/share.png'
    };

    share.title = win ? 'Я отлично помню своих друзей!' : 'Я совсем забыл своих друзей ...';
    $('[property="og:title"]').attr('content', share.title);


    $('.js-share-link.link-vk').each(function(){
      var query = [];
      query.push('url=' + encodeURIComponent(share.url));
      query.push('title=' + encodeURIComponent(share.title));
      // query.push('image=' + encodeURIComponent(share.image));
      // query.push('noparse=' + encodeURIComponent('true'));


      $(this).attr('href', $(this).attr('href') + '?' + query.join('&'));
    });

    $('.js-share-link.link-fb').each(function(){
      var query = [];
      query.push('u=' + encodeURIComponent(share.url));
      query.push('title=' + encodeURIComponent(share.title));

      $(this).attr('href', $(this).attr('href') + '?' + query.join('&'));
    });

    Game.tabs.show('finish');
  },
  init: function(array) {
    if (array.length < 4) {
      alert('Мы не смогли найти достаточно информации о Ваших друзьях');
      return;
    }

    var t = this;
    this.restart(array);

    if (!this.initialized) {
      this.initialized = true;
      
      $('.js-qAnswer').on('click', function(){
        if(t.status == 'set') {
          t.answer($(this).index());
        }
        return false;
      });

      $('.js-qNext').on('click', function(){
        $('html, body').animate({ scrollTop: 0 });
        if(t.qArray[t.activeIndex+1]) {
          t.setQuestion(t.activeIndex+1);
        } else {
          t.finish();  
        }
        return false;
      });
    }
  },


  restart: function(questions) {
    var t = this;
    t.rightCount = 0;
    
    if (questions) {
      this.qArray = questions;
    }

    t.setQuestion(0);

    Game.tabs.show('question');
  }
};