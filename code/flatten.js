/**
 * 任意维度嵌套数组降维（ES6 实现）
 *
 * @param  {Array} array 任意维度嵌套数组
 * @return {Array}       一维数组
 */
const flatten = (array) => {
  return array.reduce((previous, value) => {
    return previous.concat(Array.isArray(value) ? flatten(value) : value)
  }, [])
}

/**
 * 任意维度嵌套数组降维（ES5 实现）
 *
 * @param  {Array} array 任意维度嵌套数组
 * @return {Array}       一维数组
 */
const es5_flatten = function(array) {
    return array.reduce(function(previous, value) {
        if (Object.prototype.toString.call(value) !== '[object Array]') {
            previous.push(value)
            return previous
        }
        Array.prototype.push.apply(previous, flatten(value))
        return previous
    }, [])
}

var array1 = [[0, 1], [2, 3], [4, 5]]
var array2 = [0, [1, [2, [3, [4, [5]]]]]]

console.log(flatten(array1))
console.log(flatten(array2))
