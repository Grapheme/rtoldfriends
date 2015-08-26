function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deferred (func) {
  var dfd = $.Deferred();
  func(dfd.resolve, dfd.reject, dfd);
  return dfd.promise();
}

var MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];