function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deferred (func, maxWait) {
  var dfd = $.Deferred();
  func(dfd.resolve, dfd.reject, dfd);

  if (maxWait) {
    setTimeout(function() {
      if (dfd.state() == 'pending') {
        console.log('do not wait any more bro', func);
        dfd.resolve();
      }
    }, maxWait);
  }

  return dfd.promise();
}

var MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

// forma [day, sign1, sign2] -- day <= day ? sing1: sign2

var ZODIAK = {
  '1': [19, 'kozerog', 'vodoley'],
  '2': [18, 'vodoley', 'riby'],
  '3': [20, 'riby', 'oven'],
  '4': [19, 'oven', 'telec'],
  '5': [20, 'telec', 'bliznecy'],
  '6': [20, 'bliznecy', 'rak'],
  '7': [22, 'rak', 'lev'],
  '8': [22, 'lev', 'deva'],
  '9': [22, 'deva', 'vesy'],
  '10': [22, 'vesy', 'skorpion'],
  '11': [21, 'skorpion', 'strelec'],
  '12': [21, 'strelec', 'kozerog']
};




function rateLimit(perSecondLimit, fn, context) {
  var callsInLastSecond = 0;
  var queue = [];

  var limited = function () {
      if(callsInLastSecond >= perSecondLimit) {
          queue.push([context, arguments]);
          return;
      }
      
      callsInLastSecond++;
      fn.apply(context, arguments);

      setTimeout(function() {
          callsInLastSecond--;
          var parms;
          if (parms = queue.shift()) {
            limited.apply(parms[0], parms[1]);
          }
      }, 1010);
  };

  return limited;
}

$.whenKeys = function(obj) {
  var keys = _.keys(obj);
  var values = _.values(obj);
  return $.when.apply($, values).then(function(results) {
    return _.zipObject(keys, arguments);
  });
};  