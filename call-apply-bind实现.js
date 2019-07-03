Function.prototype.callMe = function(){
  var bindThis = arguments[0] || window;
  var fn = this;
  var args = []
  for(var i=1;i<arguments.length;i++){
    // 这里要push 这行字符串  而不是直接push 值
    // 因为直接push值会导致一些问题
    // 例如: push一个数组 [1,2,3]
    // 在下面👇 eval调用时,进行字符串拼接,JS为了将数组转换为字符串 ，
    // 会去调用数组的toString()方法,变为 '1,2,3' 就不是一个数组了，相当于是3个参数.
    // 而push这行字符串，eval方法，运行代码会自动去arguments里获取值
    args.push('arguments['+i+']');
  }
  bindThis.f = fn;
  var result = eval('bindThis.f('+args+')')
  delete bindThis.f
  return result;
}

Function.prototype.applyMe = function (bindThis = window, arr = []) {
  var fn = this;
  var args = [];
  for(var i=0;i<arr.length;i++){
    args.push('arr['+i+']')
  }
  bindThis.f = fn;
  var result = eval('bindThis.f(' + args + ')')
  delete bindThis.f
  return result;
}

Function.prototype.bindMe = function(){
  var fn = this;
  var bindThis = arguments[0] || window
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return function(){
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return fn.apply(bindThis,args)
  }
}