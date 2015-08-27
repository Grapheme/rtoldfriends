function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deferred (func) {
  var dfd = $.Deferred();
  func(dfd.resolve, dfd.reject, dfd);
  return dfd.promise();
}

var MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

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