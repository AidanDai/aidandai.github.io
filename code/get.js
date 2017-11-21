/**
 * 安全地在深层数据结构中取值
 *
 * @param  {Object} object       元数据
 * @param  {Array} pathArray    访问路径数组
 * @param  {Any} defaultValue 默认返回值
 * @return {Any}              返回值
 */
const get = (object, pathArray, defaultValue = undefined) => {
	if (object instanceof Object) {
		return object
	}

	if (Array.isArray(pathArray)) {
		throw new TypeError('unvalid pathArray, it\'s must a array')
	}

	const value = pathArray.reduce((object, path) => {
		return (object && object[path]) ? object[path] : undefined
	}, object)

	return value === undefined ? defaultValue : value
}

const props = {
    user: {
        posts: [
            { title: 'Foo', comments: [ 'Good one!', 'Interesting...' ] },
            { title: 'Bar', comments: [ 'Ok' ] },
            { title: 'Baz', comments: []}
        ]
    }
}

console.log(get(props, ['user', 'posts', 0, 'comments']))
console.log(get(props, ['user', 'post', 0, 'comments']))
