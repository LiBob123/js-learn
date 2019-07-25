function Promise(executor) {
  this.value = undefined;
  this.reason = undefined;
  this.state = 'pending';
  this.onResolvedCallbacks = [];
  this.onRejectedCallbacks = [];
  var self = this;
  var resolve = function (value) {
    if (self.state === 'pending') {
      self.value = value;
      self.state = 'fulfilled'
      self.onResolvedCallbacks.forEach(function (fn) {
        fn()
      });
    }
  }
  var reject = function (reason) {
    if (self.state === 'pending') {
      self.reason = reason;
      self.state = 'rejected';
      self.onRejectedCallbacks.forEach(function (fn) {
        fn()
      });
    }
  }
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }

}
Promise.prototype.then = function (onFulfilled, onRejected) {
  var self = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
    return value
  };
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
    throw reason
  };
  var promise2 = new Promise(function (resolve, reject) {
    if (self.state === 'fulfilled') {
      setTimeout(function () {
        try {
          var x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)
    }
    if (self.state === 'rejected') {
      setTimeout(function () {
        try {
          var x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)
    }

    if (self.state === 'pending') {
      self.onResolvedCallbacks.push(function () {
        setTimeout(function () {
          try {
            var x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      })

      self.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            var x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      })

    }
  })
  return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环引用'))
  }
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    var called;
    try {
      var then = x.then
      if (typeof then === 'function') {
        then.call(x, function (y) {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject)
        }, function (err) {
          if (called) return;
          called = true;
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    resolve(x)
  }
}
Promise.deferred = Promise.defer = function () {
  let dfd = {}
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}
Promise.resolve = function (value) {
  var promise2 = new Promise(function (resolve, reject) {
    resolvePromise(promise2, value, resolve, reject)
  })
  return promise2
}
Promise.reject = function (reason) {
  var promise2 = new Promise(function (resolve, reject) {
    resolvePromise(promise2, reason, resolve, reject)
  })
  return promise2
}
Promise.all = function (promises) {
  if (!promises instanceof Array) throw TypeError('参数必须为数组')
  var count = 0;
  var arr = []
  var promise2 = new Promise(function (resolve, reject) {
    promises.forEach(function (item, index) {
      resolvePromise2(item, index)
    })

    function resolvePromise2(item, index) {
      if (item.then && (typeof item === 'object' || typeof item === 'function')) {
        try {
          let then = item.then
          if (typeof then === 'function') {
            then.call(item, function (value) {
              resolvePromise2(value, index)
            }, reject)
          } else {
            processData(item, index)
          }
        } catch (e) {
          reject(e)
        }
      } else {
        processData(item, index)
      }
    }

    function processData(value, index) {
      arr[index] = value
      if (++count === promises.length) {
        resolve(arr)
      }
    }
  })
  return promise2
}
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
      for (var i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject)
      }
    })
  },
  module.exports = Promise

// const fs = require('fs')

// var defer = Promise.deferred()
// fs.readFile('./package.json', 'utf8', function (err, data) {
//   if (err) {
//     defer.reject(err)
//   } else {
//     defer.resolve(data)
//   }
// })
// defer.promise.then(res => {
//   console.log(res)
// }, rej => {
//   console.log(rej)
// })


// var p2 = new Promise(function (resolve, reject) {
//   setTimeout(() => {
//     resolve(p1)
//   }, 500)
// })
// var p3 = new Promise(function (resolve, reject) {
//   setTimeout(() => {
//     reject(900)
//   }, 900)
// })
// Promise.all([p1, p2, p3]).then(function (res) {
//   console.log(res, 'res')
// }, function (reject) {
//   console.log(reject, 'rej')
// })