var rand = require('seed-random');

exports.methodWrap = function (self, fn, rate) {
  var thisRand = rand('a seed');
  return function () {
    if (thisRand() <= rate) {
      var realCB = arguments[arguments.length - 1];
      realCB('induced_failure');
    } else {
      fn.apply(self, arguments);
    }
  }
}

exports.objectWrap = function (opts, objectCreator) {
  if (!opts.failMethods) throw new Error('fail-wrapper must be given "failMethods" in the options object');
  if (!opts.failRate) throw new Error('fail-wrapper must be given "failRate" in the options object');

  var returnObjects = [];
  opts.failMethods.forEach(function (method) {
    var newObject = objectCreator();
    newObject[method] = exports.methodWrap(newObject, newObject[method], opts.failRate);
    returnObjects.push(newObject);
  });

  return returnObjects;
}
