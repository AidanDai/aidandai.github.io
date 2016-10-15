/*// let objPerson = {
// 	name: "Aidan",
// 	age: 23,
// 	job: "Junier Front-end Egnieer",
// 	local: "ShanXi",
// 	[Symbol.iterator]: function(){
// 		var keys = Object.keys(this).sort(),
// 			len = keys.length,
// 			index = 0,
// 			that = this;

// 		return {
// 			next: function(){
// 				return index < len
// 					? {value: that[keys[index++]], done: false}
// 					: {value: undefined, done: true};
// 			}
// 		}
// 	}
// }

// let objPerson = {
// 	name: "Aidan",
// 	age: 23,
// 	job: "Junier Front-end Egnieer",
// 	local: "ShanXi",
// 	[Symbol.iterator]: function(){
// 		var keys = null,
// 			len = null,
// 			index = 0,
// 			that = this;

// 		return {
// 			next: function(){
// 				if(keys === null){
// 					keys = Object.keys(that).sort();
// 					len = keys.length;
// 				}
// 				return index < len
// 					? {value: that[keys[index++]], done: false}
// 					: {value: undefined, done: true};
// 			}
// 		}
// 	}
// }

let objPerson = {
	name: "Aidan",
	age: 23,
	job: "Junier Front-end Egnieer",
	local: "ShanXi",
	[Symbol.iterator]: function* () {
		var keys = Object.keys(this).sort();

		for(let item of keys){
			yield this[item];
		}
	}
};

for(let val of objPerson){
	console.log(val);
}
// 23
// Junier Front-end Egnieer
// ShanXi
// Aidan

let ite = objPerson[Symbol.iterator]();
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
// { value: 23, done: false }
// { value: 'Junier Front-end Egnieer', done: false }
// { value: 'ShanXi', done: false }
// { value: 'Aidan', done: false }
// { value: undefined, done: true }
// { value: undefined, done: true }*/

/*function* generator () {
	for(let i=0; i<5; i+=1){
		yield i;
	}
}

let gen = generator();

for(let val of gen){
	console.log(val);
}*/

/*function* f() {
  for(var i=0; true; i++) {
    var reset = yield i;
    console.log(reset);
    if(reset) { i = -1; }
  }
}

var g = f();

console.log(g.next()); // { value: 0, done: false }
console.log(g.next()); // { value: 1, done: false }
console.log(g.next(true)); // { value: 0, done: false }
console.log(g.next()); // { value: 0, done: false }
console.log(g.next()); // { value: 0, done: false }
console.log(g.next()); // { value: 0, done: false }*/

/*function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}*/

/*var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b*/

/*var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log("Inner Error: " + e);
  }
};

var i = g();
i.next();
i.throw(new Error('出错了！'));
// Inner Error: Error: 出错了！*/

/*var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    console.log("Inner Error: " + e);
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // Inner Error: undefined // b
g.next() // c*/

/*function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers()
console.log(g.next()) // { done: false, value: 1 }
console.log(g.next()) // { done: false, value: 2 }
console.log(g.return(7)) // { done: false, value: 4 }
console.log(g.next()) // { done: false, value: 5 }
console.log(g.next()) // { done: true, value: 7 }

console.log(g.next()) // { value: undefined, done: true }
console.log(g.next()) // { value: undefined, done: true }*/

/*//下面是一个稍微复杂的例子，使用yield*语句遍历完全二叉树。

// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([
	[
		['a'], 
		'b', 
		['c']
	], 
	'd', 
	[
		['e'], 
		'f', 
		['g']
	]
]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

console.log(result);
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']*/

/*function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

console.log(obj instanceof g); // true
console.log(obj.hello()); // 'hi!'*/

function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = F();

console.log(f.next());  // Object {value: 2, done: false}
console.log(f.next());  // Object {value: 3, done: false}
console.log(f.next());  // Object {value: undefined, done: true}

console.log(f.a); // 1
console.log(f.b); // 2
console.log(f.c); // 3

console.log(f instanceof F); // false
console.log(Object.prototype.toString.call(f)); // [object Generator]
console.log(f.toString()); // [object Generator]