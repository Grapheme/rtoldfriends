Game.questions = {
  qArray: [],
  fullArray: [],
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
      .removeClass('choice-fail choice-success')
      .each(function(){

        $(this).find('.js-qaTitle').text('');
        $(this).find('.js-qaImage').text('').css('background-image', ''); 

        var answer = question.answers[$(this).index()];
        if (!answer) return;

        if (question.type == 'text') {
          $(this).find('.js-qaImage').text(answer.title);
        } else if (question.type == 'people') {
          $(this).find('.js-qaImage').css('background-image', 'url(' + answer.image || '' + ')'); 
          $(this).find('.js-qaTitle').text(answer.title);
        }
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
    if (array.length < 5) {
      alert('мало информации');
      return;
    }


    var t = this;
    t.fullArray = array;
    for(var i = 0; i < 5; i++) {
      var thisNumber = randomInt(0, array.length - 1);
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
};