//斐波拉契数列

//1.递归版
function fibonacci(n){
  if(n<=2) return 1;
  return fibonacci(n-1) + fibonacci(n-2)
}

//缓存数据
var arr2 = [];
function fibonaccih(n) {
  if (n === 0) return 0
  if (n === 1) return 1
  if (!arr2[n - 1]) arr2[n - 1] = fibonaccih(n - 1)
  if (!arr2[n - 2]) arr2[n - 2] = fibonaccih(n - 2)
  return arr2[n - 1] + arr2[n - 2]
}


//2.递归优化版
function fibonacci2(n,c1=1,c2=1){
    if(n<=2) return c2;
    return fibonacci2(n - 1, c2, c1 + c2)
}

//3.循环版本
function fibonacci3(n){
  var c1 = 1,c2 = 1;
  if(n>2){
    for(var l=2;l<n;l++){
      [c1,c2] = [c2,c1+c2]
    }
  }
  return c2
}
function fibonacci4(n, c1 = 1, c2 = 1) {
  while(--n>=2){
    [c1,c2] = [c2,c1+c2]
  }
  return c2
}