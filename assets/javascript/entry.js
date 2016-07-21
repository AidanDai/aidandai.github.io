/*import testClass from './test.js';

console.log(Object.getOwnPropertyNames(testClass.prototype));

testClass.hello();
testClass.world();*/

function test(){
	var temp = 1024;
	for(var i=1; i<=10; i++){
		var item = temp - 72;
		temp = item;
		console.log(item);
	}
}
test();