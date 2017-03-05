---
layout: post
h1: "share & note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: then/promise 源码解析
type: 【原创】
category: javascript

tags: promise

keyword: promise 源码解析 

author: Aidan
date: 2017-03-05
---

为了能更好的了解 promise 背后的实现机制，特意拜读了 then/promise 的源码，收获颇丰

* TOC
{:toc}

```javascript
'use strict'; 

// var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending 等待态（Pending）
// 1 - fulfilled with _value 执行态（Fulfilled）
// 2 - rejected with _value 拒绝态（Rejected）
// 3 - adopted the state of another promise, _value 采用另一个 Promise 的状态
//
// once the state is no longer pending (0) it is immutable 也就是执行态（Fulfilled）、拒绝态（Rejected）说不能迁移至其他任何状态


// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate(混淆) them and discourage(阻碍) their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {}; // 为什么要初始化为 {}?
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a); // return 很重要，意味着你可以在 then 里使用另一个 promise
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
// fn 为 Promise 传入的匿名函数
// 在这里可以看出为什么你在 fn 中 return 任何值都不会影响 then
function tryCallTwo(fn, a, b) {
  try {// 若发生意外错误，直接退出
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  // _deferredState 表示 _deferreds 的类型
  // 0 时表示 null, 1 时表示单个 deferred, 2 表示多个deferred(数组)
  this._deferredState = 0;
  this._state = 0;
  this._value = null;// 终值/拒因
  this._deferreds = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;

// then 同步执行
Promise.prototype.then = function(onFulfilled, onRejected) {
  // 是 thenable 但不是原生的 Promise 实例时执行(非法的 then 时执行)
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  // deferred 的数据结构
  // {
  //   onFulfilled: function | null,
  //   onRejected: function | null,
  //   promise: Promise // then 产生的新 Promise
  // }
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  // 追上正常的调用进度
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  // 1 在 resolve 的是一个 promise 实例时执行 while
  // 2 在 then 返回一个新的 promise 实例时执行 while
  // 需要根据新的 promise 的状态确定执行 reejct 还是 resolve
  // 1
  // var p = new Promise((resolve, reject) => {
  //   reject('p reject')
  // })
  // new Promise((resolve, reject) => {
  //   resolve(p)
  // }).then((v) => {
  //   console.log(v)
  // }, (e) => {
  //   console.log(e)
  // })
  // 2
  // new Promise((resolve, reject) => {
  //   resolve(1)
  // }).then((v) => {
  //   console.log(v)
  //   return new Promise((resolve, reject) => {
  //     reject(1)
  //   })
  // }, (e) => {
  //   console.log(e)
  // }).then((v) => {
  //   console.log(v)
  // }, (e) => {
  //   console.log(e)
  // })
  while (self._state === 3) {
    self = self._value;
  }
  // Promise._onHandle 可以理解为监听 handle 的事件处理函数
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  // 构造时未 resolve 或 reject时执行
  // then 时一定会执行
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred; // 链式处理
      return;
    }
    if (self._deferredState === 1) {// 什么时候为 1 呢？
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  setImmediate(function() { // asap 相当于 setImmediate
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    // ret 为 IS_ERROR 或者 onFulfilled/onRejected 的返回值
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      // 当你在 then 中 return 了一个新的 promise
      // resolve(deferred.promise, promise)
      // handle 时便会走 while 用新的 promise 替换旧的（跳过 deferred.promise）
      // 于是执行的任务流程便按我们预想的那样继续进行
      resolve(deferred.promise, ret);
    }
  });
}
// newValue 为 resolve 的参数
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  // 传入值等于自己就抛出错误
  // 我觉得基本不可能传入自己
  // new Promise(fun) 实例化时fun中无法得到 Promise 自己
  if (newValue === self) {
    return reject( 
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if ( // 传入值为对象或函数（其实就是对象）
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    // 什么情况下走这条路呢？（我觉得不可能走这条路）
    // 取对象的属性只可能得到 undefined 或者真值
    // 所以我觉得不可能走这个 if 分之
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (// 当 resolve 一个 Promise 实例时
      // 确保为没有被修改过的原生 Promise 实例
      // 避免 
      // var p = new Promise((resolve, reject) => {
      //   resolve(1)
      // })
      // p.then = function(){
      //   
      // }
      // 如果是被窜改过的 Promise 实例后面 p.then() 会报错
      then === self.then && // 确保是没有被修改过的原生 Promise 实例
      newValue instanceof Promise // resolve 一个 Promise 实例时
    ) {
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      // getThen(obj) 只是返回一个函数（在严格模式下，函数的 this 为 undefined）
      // then.bind(newValue) 保证 then 的上下文执行环境
      // 不能直接 resolve 一个不可靠的 thenable 对象
      //（同不能 resolve() 一个被篡改过的 Promise）
      // 将不可靠的 thenable 转换为可靠的对象后再 resolve（递归）
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._state = 1;
  self._value = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  // Promise._onReject 可以理解为监听 reject 的事件处理函数
  if (Promise._onReject) { 
    Promise._onReject(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }
  if (self._deferredState === 2) {
    for (var i = 0; i < self._deferreds.length; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially(潜在地) misbehaving(作弊) resolver(解析器) function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees(担保) about asynchrony(异步).
 */
function doResolve(fn, promise) {
  // done 保证了 resolve 和 reject 只执行一个
  // new Promise((resolve, reject) => {
  //   resolve(1) // 全部执行结束(执行内部的resolve)
  //   reject(2) // 立即 return
  // }).then((value) => {
  //   console.log(value)
  // }, (reason) => {
  //   console.log(reject)
  // })
  var done = false;
  // tryCallTwo 解决了 Promise 函数传入的匿名函数中抛出的意外错误
  // 若传入的匿名函数抛出意外错误直接 reject
  var res = tryCallTwo(fn, function (value) {// 暴露的给开发者的 resolve(适配器)
    if (done) return; // 确保只执行内部的 resolve 或 reject 
    done = true;
    resolve(promise, value);
  }, function (reason) {// 暴露的给开发者的 reject
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) { // 用户业务逻辑代码抛异常，自动 reject
    done = true;
    reject(promise, LAST_ERROR);
  }
}
```