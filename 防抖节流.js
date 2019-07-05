//防抖
function debounce(fn, delay) {
  var timer; // 维护一个 timer
  return function () {
    var _this = this; // 取debounce执行作用域的this
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn.apply(_this, args); // 用apply指向调用debounce的对象，相当于_this.fn(args);
    }, delay);
  };
}




//节流
function throttle(fn, delay) {
  var timer;
  return function () {
    var _this = this;
    var args = arguments;
    if (timer) {
      return;
    }
    timer = setTimeout(function () {
      fn.apply(_this, args);
      timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
    }, delay)
  }
}

function throttleTime(fn, delay) {
  var previous = 0;
  // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
  return function () {
    var _this = this;
    var args = arguments;
    var now = new Date();
    if (now - previous > delay) {
      fn.apply(_this, args);
      previous = now;
    }
  }
}
//首次执行
function debounce2(fn, delay = 200, atBegin = true) {
  let timer = null,
    last = 0,
    during;
  return function () {
    let self = this,
      args = arguments;
    var exec = function () {
      fn.apply(self, args);
    }
    if (atBegin && !timer) {
      exec();
      atBegin = false;
    } else {
      during = Date.now() - last;
      if (during > delay) {
        exec();
      } else {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          exec();
        }, delay);
      }
    }
    last = Date.now();
  }
}