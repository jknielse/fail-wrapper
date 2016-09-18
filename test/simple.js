var assert     = require('assert');

var failWrapper = require('../index');

var objectCreator = function () {
  return {
    'method1': function (arg, callback) {
      callback(null, arg);
    },
    'method2': function (cb) {
      cb(null);
    },
    'method3': function () {
      return 10;
    }
  }
}

describe('Simple Tests', function () {
  it('Test object works', function (done) {
    var ob = objectCreator();
    ob.method1('hi', function (err, result) {
      assert.ok(!err);
      assert.equal(result, 'hi');
      ob.method2(function (err) {
        assert.ok(!err);
        assert.equal(ob.method3(), 10);
        done();
      });
    });
  });

  it('Test wrap first method', function (done) {
    var wrappedObjects = failWrapper.objectWrap({
      failRate: 1,
      failMethods: ['method1']
    }, objectCreator);
    assert.equal(wrappedObjects.length, 1);
    var ob = wrappedObjects[0];
    ob.method1('hi', function (err, result) {
      assert.equal(err, 'induced_failure');
      assert.equal(result, null);
      ob.method2(function (err) {
        assert.ok(!err);
        assert.equal(ob.method3(), 10);
        done();
      });
    });
  });

  it('Test wrap second method', function (done) {
    var wrappedObjects = failWrapper.objectWrap({
      failRate: 1,
      failMethods: ['method2']
    }, objectCreator);
    assert.equal(wrappedObjects.length, 1);
    var ob = wrappedObjects[0];
    ob.method1('hi', function (err, result) {
      assert.ok(!err);
      assert.equal(result, 'hi');
      ob.method2(function (err) {
        assert.equal(err, 'induced_failure');
        assert.equal(ob.method3(), 10);
        done();
      });
    });
  });
});
