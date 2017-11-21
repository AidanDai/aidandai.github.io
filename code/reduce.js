/**
 * reduce 方法的实现
 *
 * @param  {Array}   array        调用数组对象
 * @param  {Function} fn           回调函数
 * @param  {Any}   initialValue 初始化值
 * @return {Any}                返回值
 */
const reduce = (array, fn, initialValue) => {
	let base = typeof initialValue === 'undefined' ? array[0] : initialValue
	const startIndex = typeof initialValue === 'undefined' ? 1 : 0

	array.slice(startIndex).forEach((value, index) => {
		base = fn(base, value, index + startIndex, array)
	})

	return base
}

console.log(reduce([1,2,3,4,5], (pre, value) => pre + value, 0))
