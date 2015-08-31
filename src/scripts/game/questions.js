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
      .each(function(){
        $(this).find('.js-qaTitle').text('');
        $(this).find('.js-qaImage').css('background-image', ''); 
        $(this).find('.js-qaImage div').text('');

        var answer = question.answers[$(this).index()];
        if (!answer) return;

        if (question.type == 'text') {
          $(this).find('.js-qaImage div').text(answer.title);
        } else if (question.type == 'people') {
          // $(this).find('.js-qaImage div').text(answer.title); 
          $(this).find('.js-qaImage').css('background-image', 'url(' + (answer.image || '') + ')'); 
          $(this).find('.js-qaTitle').text(answer.title);
        }
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