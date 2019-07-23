class Dep{
  constructor() {
    this.subs = []
  }
  addSub(sub){
    this.subs.push(sub)
  }
  removeSub(sub){
    if(this.subs.length>0){
      const index = this.subs.indexOf(sub)
      if(index>-1){
        this.subs.splice(index,1)
      }
    }
  }
  depend(){
    if(window.target){
      this.addSub(window.target)
    }
  }
  notify(){
    const subs = this.subs.slice()
    for(let i=0,l=subs.length;i<l;i++){
      subs[i].update();
    }
  }
}

function defineReactive(data,key,val){
  var dep = new Dep();
  Object.defineProperty(data,key,{
    enumerable:true,
    configurable:true,
    get:function(){
      dep.depend()
      return val
    },
    set:function(newVal){
      if(val === newVal){
        return
      }
      val = newVal;
      dep.notify();
    }
  })
}