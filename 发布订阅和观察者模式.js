//1.发布订阅
//         发布消息                  触发事件
// 发布者 ——————————>  调度中心    ——————————>    订阅者
//                                   订阅

//2.观察者模式
//           触发事件
// 目标 ————————————————————>    观察者
//           订阅目标                            

//从上面以看出， 观察者模式中观察者和目标直接进行交互， 而发布订阅模式中统一由调度中心进行处理，
//订阅者和发布者互不干扰。 这样一方面实现了解耦， 还有就是可以实现更细粒度的/一些控制。
//比如发布者发布了很多消息， 但是不想所有的订阅者都接收到， 就可以在调度中心做一些处理， 类似于权限控制之类的。 还可以做一些节流操作

//1.发布订阅
class PubSub{
  constructor(){
    this.subscribers = {}
  }
  on(type, handler) {
    if(!this.subscribers[type]){
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(handler)
    return this;
  }
  off(type, handler) {
    var currentEvent = this.subscribers[type]
    if (currentEvent && currentEvent.length > 0) {
      currentEvent.filter(h => {
        h !== handler
      })
    }
    return this;
  }
  emit(type,...args){
    let events = this.subscribers[type];
    if (!events || !events.length) return;
    events.forEach(fn => fn(...args));
  }
}
var zufang = new PubSub()
//订阅者
function xiaoming(val){
  console.log('xiaoming收到订阅消息:'+ val)
}
function jack(val){
  console.log("jack收到订阅消息:" + val)
}
function bob(val){
  console.log('bob收到订阅消息：'+val)
}
zufang.on('smallRoom', xiaoming)
zufang.on('bigRoom', jack)
zufang.on('bigRoom', bob)
zufang.emit('bigRoom', '有大房子啦')
zufang.emit('smallRoom', '有大房子啦')
zufang.off('bigRoom', jack)
console.log(zufang.subscribers)


//2.观察者模式
//观察者
class Observer{
  constructor(name){
    this.name = name
  }
  update(val){
    console.log(this.name+'收到目标消息'+val)
  }
}

//目标（被观察者）
class Subject{
  constructor(){
    this.observers =[]
  }
  addObserver(observer){
    // if (this.observers.findIndex(ob => {return ob === observer}) > -1) {
    // if (this.observers.some(ob => {return ob === observer})) {
    if (this.observers.find(ob => {return ob === observer})) {
      console.warn('已经添加过了')
    } else {
      this.observers.push(observer);
    }
  }
  removeObserver(observer){
     this.observers = this.observers.filter(ob => ob !== observer)
  }
  notify(...args){
    this.observers.forEach(ob=>{
      ob.update(...args)
    })
  }
}
var father = new Observer('爸爸');
var mother = new Observer('妈妈');
var child = new Subject()
child.addObserver(father)
child.addObserver(mother)
child.notify('我饿了')

