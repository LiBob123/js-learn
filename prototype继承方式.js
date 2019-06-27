// JS的6种常见继承模式
// 数天前在知乎看到有人阿里面试被问到这个问题， 我来总结一下。

// 1. 原型链继承：
function SuperType() {
   this.property = true;
}
SuperType.prototype.getSuperProperty = function () {
  return this.property;
};

function SubType() {}
SubType.prototype = new SuperType();
var o = new Subtype();
console.log(o.getSuperProperty); // true
// 原型链的问题： 子类所有对象的原型都是同一父类对象， 如果我们修改到了原型对象， 那么所有子类对象内容都会改变。
// 2. 借用构造函数（ 也称作伪造对象继承和经典继承）：
// 借用构造函数是在子类中调用父类的构造函数（ 所谓借用）。
function SuperType() {
  this.property = ['hello', 'world'];
}
function SubType() {
  SuperType.call(this);
}
// 构造函数的问题： 父类在原型链中定义的函数不能被子类访问， 也就是说所有的函数都必须写在构造函数内部， 无法复用。



// 3. 组合继承（ 伪经典继承） * ：
  // 将原型链继承和借用构造函数继承组合到一起。
function SuperType(name) {
  this.name = name;
  this.color = ['red', 'green', 'blue'];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name) {
   SuperType.call(this, name); // 第二次调用
}

 SubType.prototype = new SuperType(); // 第一次调用
 SubType.prototype.constructor = Subtype; // 为了以后判断类型
// 不过组合继承也不是没有缺点， 就是会至少调用两次构造函数， 第一次调用在原型中添加了 SuperType 所拥有的属性， 第二次调用的时候又覆盖了一次。 这个开销其实是没有必要的。

// 4. 原型式继承：
Ojbect.create(prototypeObj);
// 这个方法会创建一个新的对象， 新的对象的原型是 prototypeObj。
// 缺点和原型继承一样。


// 5. 寄生式继承：
// 核心思想在于在函数内部增强对象， 返回一个新对象。
function createAnother(obj) { 
  var clone = Object.create(obj);
   clone.sayHello = function () {
     console.log('Hello');
  };
  return clone;
}

// 6. 寄生组合式继承：
// 完善组合式继承， 不必为了指定子类型的原型而调用超类的构造函数， 我们需要的无非就是超类的原型的一个副本（ 创造副本是为了子类上属性的修改不影响在原型链上的父类） 而已， 我们在一个函数里创建一个增强过的对象作为子类的原型（ 所谓寄生）。
function SuperType(name) {
   this.name = name;
}
SuperType.prototype.sayName = function () {
   console.log(this.name);
};

function SubType(name) {
   Super.call(this, name);
}

function inheritPrototype(subType, superType) {
  var prototype = Object(superType.prototype);
   // 如果不像上面这么写，那么在子类添加方法会影响到父类，这不合理。
  prototype.constructor = subType;
  subType.prototype = prototype;
}

 inheritPrototype(SubType, SuperType);
// 这个没什么缺点， 主要是写着稍微麻烦一点。








//第二种例子：
function Person(name) {
  this.name = name;
  this.sum = function () {
    console.log(this.name)
  }
}
Person.prototype.age = 10;


//1.原型链继承
function Per(){
  this.name = "ker";
}
Per.prototype = new Person(); //主要
var per1 = new Per();
// console.log(per1 instanceof Person) //true
// 重点： 让新实例的原型等于父类的实例。
// 特点： 1、 实例可继承的属性有： 实例的构造函数的属性， 父类构造函数属性， 父类原型的属性。（ 新实例不会继承父类实例的属性！）
// 缺点： 1、 新实例无法向父类构造函数传参。
//       2、 继承单一。
//       3、 所有新实例都会共享父类实例的属性。（ 原型上的属性是共享的， 一个实例修改了原型属性， 另一个实例的原型属性也会被修改！）

//2.借用构造函数继承
function Con(){
  Person.call(this,'jer'); //重点
  this.age = 12;
}
var con1 = new Con();
console.log(con1.name) //jer
console.log(con1.age)  //12
console.log(con1 instanceof Person); //false
// 重点： 用.call() 和.apply() 将父类构造函数引入子类函数（ 在子类函数中做了父类函数的自执行（ 复制））
// 特点： 1、 只继承了父类构造函数的属性， 没有继承父类原型的属性。
// 2、 解决了原型链继承缺点1、 2、 3。
// 3、 可以继承多个构造函数属性（ call多个）。
// 4、 在子实例中可向父实例传参。
// 缺点： 1、 只能继承父类构造函数的属性。
//        2、 无法实现构造函数的复用。（ 每次用每次都要重新调用）
//        3、 每个新实例都有父类构造函数的副本， 臃肿。


//3.组合式继承（组合原型链继承和借用构造函数继承） 常用
function SubType(name){
  Person.call(this,name); //借用构造函数模式
}
SubType.prototype = new Person(); //原型链继承
var sub = new SubType('gar');
console.log(sub.name);//gar 继承了构造函数的属性
console.log(sub.age);//10   继承了父类原型的属性
// 重点： 结合了两种模式的优点， 传参和复用
// 特点： 1、 可以继承父类原型上的属性， 可以传参， 可复用。
//       2、 每个新实例引入的构造函数属性是私有的。
// 缺点： 调用了两次父类构造函数（ 耗内存）， 子类的构造函数会代替原型上的那个父类构造函数。

//4.原型式继承
  //先封装一个函数容器，用来输出对象和承载继承的原型
function content(obj){
  function F(){}
  F.prototype = obj;//继承了传入的参数
  return new F();//返回含税
}

var sup = new Person();//拿到父类实例子
var sup1 = content(sup);
console.log(sup1.age) // 10  继承了父类函数的属性
// 重点： 用一个函数包装一个对象， 然后返回这个函数的调用， 这个函数就变成了个可以随意增添属性的实例或对象。 object.create() 就是这个原理。
// 特点： 类似于复制一个对象， 用函数来包装。
// 缺点： 1、 所有实例都会继承原型上的属性。
//       2、 无法实现复用。（ 新实例属性都是后面添加的）

//5. 寄生式继承
function content2(obj){
  function F(){}
  F.prototype = obj;
  return new F();
}
var sup = new Person();
function subobject(obj){
  var sub = content2(obj);
  sub.name = 'gar';
  return sub;
}
var sup2 = subobject(sup);
console.log(typeof subobject);//function
console.log(typeof sup2);//object
console.log(sup2.name); //'gar' 返回sub对象，继承了sub的属性
// 重点： 就是给原型式继承外面套了个壳子。
// 优点： 没有创建自定义类型， 因为只是套了个壳子返回对象（ 这个）， 这个函数顺理成章就成了创建的新对象。
// 缺点： 没用到原型， 无法复用。

//寄生组合式继承（常用）
  //寄生：在函数内返回对象然后调用
  //组合：1、函数的原型等于另一个实例。2、在函数中的apply 或者 call 引用另一个构造函数，可以传参
function content3(obj){
  function F(){}
  F.prototype = obj;
  return new F();
}
//content3就是F实例的另一种表示法
var con3 = content3(Person.prototype);
//con3实例（F实例） 的原型继承了父类函数的原型 更像原型链继承 ，只不过只继承了原型属性
//组合
function Sub(){
  Person.call(this); //这个继承了父类构造函数的属性 解决了组合式两次调用构造函数属性的缺点
}
//重点
Sub.prototype = con3;//继承了con实例
con3.constructor = Sub; // 一定要修复实例
var  sub1 = new Sub(); // Sub的实例就继承了构造函数属性，父类实例 con的函数属性
console.log(sub1.age);
// 重点： 修复了组合继承的问题

// 继承这些知识点与其说是对象的继承， 更像是函数的功能用法， 如何用函数做到复用， 组合， 这些和使用继承的思考是一样的。 上述几个继承的方法都可以手动修复他们的缺点， 但就是多了这个手动修复就变成了另一种继承模式。

// 这些继承模式的学习重点是学它们的思想， 不然你会在coding书本上的例子的时候， 会觉得明明可以直接继承为什么还要搞这么麻烦。 就像原型式继承它用函数复制了内部对象的一个副本， 这样不仅可以继承内部对象的属性， 还能把函数（ 对象， 来源内部对象的返回） 随意调用， 给它们添加属性， 改个参数就可以改变原型对象， 而这些新增的属性也不会相互影响。