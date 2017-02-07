---
layout: post
h1: "share & note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: MongoDB 中的关系
type: 【整理】
category: MongoDB
tags: 数据库设计

keyword: 关系 引用 文档

author: Aidan
date: 2016-11-27
---

* TOC
{:toc}

关系型数据和非关系型型数据库是当前市面上主要的两种数据库类型，今天我们要一起学习的 [MongoDB](https://www.MongoDB.com/) 是介于关系型与非关系型数据之间的，MongoDB 可以将文档内容嵌入到另一个文档中，也可以将文档内容引用到另一个文档中。嵌入意味着要把某一类型的数据，如包含更多数据的数组，嵌入到文档本身。引用意味着创建一个引用，包含另一个文档的数据。相当于关系型数据库。 

# 1 MongoDB 中的关系类型

MongoDB 的关系表示多个文档之间在逻辑上的相互联系。

MongoDB 中的关系可以是：（我们拿简单博客系统来举例说明）

```
1: 1 (1对1)；例如：某篇博客和某位用户的评论
1: N (1对多)；例如：某位用户和他的博客
N: 1 (多对1)；例如：某篇博客的全部评论和这篇博客
N: N (多对多)；例如：博客表和评论表
```

这与关系型数据库的关系类型基本一致。

# 2 MongoDB 关系的实现

我们来看这样一个例子：用户与用户地址的关系。很明显可以分析出一个用户可以有多个地址，所以用户与用户地址是一对多的关系。

以下是 user 文档的简单结构：

```javascript
{
  "_id":ObjectId("52ffc33cd85242f436000001"),
  "name": "Tom Hanks",
  "contact": "987654321",
  "dob": "01-01-1991"
}
```

以下是 address 文档的简单结构：

```javascript
{
  "_id":ObjectId("52ffc4a5d85242602e000000"),
  "building": "22 A, Indiana Apt",
  "pincode": 123456,
  "city": "Los Angeles",
  "state": "California"
} 
```

## 2.1 嵌入式关系

使用嵌入式方法，我们可以把用户地址嵌入到用户的文档中：

```javascript
{
  "_id":ObjectId("52ffc33cd85242f436000001"),
  "contact": "987654321",
  "dob": "01-01-1991",
  "name": "Aidan",
  "address": [
    {
      "building": "22 A, Indiana Apt",
      "pincode": 123456,
      "city": "Los Angeles",
      "state": "California"
    },
    {
      "building": "170 A, Acropolis Apt",
      "pincode": 456789,
      "city": "Chicago",
      "state": "Illinois"
    }
  ]
} 
```

以上数据保存在单一的文档中，可以比较容易的获取和维护数据。 你可以这样查询用户的地址：

```javascript
db.user.findOne({"name":"Aidan"},{"address":1})
```

这种数据结构的缺点是，如果用户和用户地址在不断增加，数据量不断变大，会影响读写性能。

## 2.2 引用式关系

引用式关系是设计数据库时经常用到的方法，这种方法把用户数据文档和用户地址数据文档分开，通过引用文档的 id 字段来建立关系。理解关系型数据库的同学可以把这理解为 关系型数据库 中的 jion 操作。

address 文档:

```javascript
{ 
    "_id" : ObjectId("52ffc4a5d85242602e000000"), 
    "building" : "22 A, Indiana Apt", 
    "pincode" : 123456.0, 
    "city" : "Los Angeles", 
    "state" : "California"
}
{ 
    "_id" : ObjectId("52ffc4a5d85242602e000001"), 
    "building" : "170 A, Acropolis Apt", 
    "pincode" : 456789.0, 
    "city" : "Chicago", 
    "state" : "Illinois"
}
```

user 文档：

```javascript
{
  "_id":ObjectId("52ffc33cd85242f436000001"),
  "contact": "987654321",
  "dob": "01-01-1991",
  "name": "Aidan",
  "address_ids": [
    ObjectId("52ffc4a5d85242602e000000"),
    ObjectId("52ffc4a5d85242602e000001")
  ]
}
```

以上实例中，user 文档的 address_ids 字段包含用户地址的对象id（ObjectId）数组。我们可以读取这些用户地址的对象id（ObjectId）来获取用户的详细地址信息。

这种方法需要两次查询，第一次查询用户地址的对象id（ObjectId），第二次通过查询的id获取用户的详细地址信息。

```javascript
var result = db.user.findOne({"name":"Aidan"},{"address_ids":1})

var addresses = db.address.find({"_id":{"$in":result["address_ids"]}})
```

# 3 嵌入型关系和引用型关系的比较


## 3.1 嵌套型关系

优点：快速、高效、简单

缺点：需要定期去更新用户信息，这个频度不好把握。（需要考虑原子性，这点和关系型数据库类似）

使用场景：小的子文档、数据不经常改变、当最终一致性是可以接受的、文档增长小、经常需要进行二次查询来获取数据、读快

现有的线上方案，如豆瓣用户的信息修改，是一个星期还是一个月只能修改一次（不太记得了）。所有可以采取这个方案，让用户不要频度太高的更新资料。当然也可以定期去更新同步两个文档自己的相关信息。（例如：PV在凌晨3点最低的时候）

## 3.2 引用型关系

优点：两个文档的数据同步更新。

缺点：查询耗时。如果是个频繁调用的功能，缺点会被放大。

使用场景：大的子文档、非易失性数据、当实时一致性是必要的、文档增长大、经常需要从结果中排除数据、写快

*****************

到底使用哪种类型的关系主要还是要根据你业务来看。考虑当前应用的体量和用户的特征。比如可以选择折中的方式，例如采用嵌套方式，可以更新头像时，将频繁调用的数据更新，一般的数据，放到后面定时更新等等。

# 4 MongoDB 数据库引用的实现

在很多场景下，把数据嵌入到文档足以满足很多应用程序。然而，有时就需要引用另一个文档。

在 MongoDB 中的文档引用是通过执行额外的查询来解决的。 MongoDB 提供两种方式来实现：

- 手动引用（Manual References）
- DBRefs

## 4.1 手动引用（Manual References）

手动引用是最简单最直接的方式。当手动引用数据时，将其他文档的 _id 值存储在你的文档中。实例如下：

```javascript
var address = [
	{ 
    "_id" : 1, 
    "building" : "22 A, Indiana Apt", 
    "pincode" : 123456.0, 
    "city" : "Los Angeles", 
    "state" : "California"
	},
	{ 
    "_id" : 2, 
    "building" : "170 A, Acropolis Apt", 
    "pincode" : 456789.0, 
    "city" : "Chicago", 
    "state" : "Illinois"
	}
];

db.address.insert(address[0]);
db.address.insert(address[1]);
```

手动实现引用：

```javascript
var address_id = [1, 2];
var user = {
	"contact": "987654321",
	"dob": "01-01-1991",
	"name": "Aidan",
	"address_ids": address_id
};

db.user.insert(user);
```

检索：

```javascript
var result = db.user.findOne({"name": "Aidan"}, {"address_ids": 1});

db.address.find({"_id": {"$in": result["address_ids"]}});
```

## 4.2 DBRefs

DBRefs 提供了一个更正式的规范引用文档之间的数据。在 DBRefs 中，数据库引用以标准的 JSON/BSON 嵌入对象存储的。

语法： 

```
{ $ref: <collectionname>, $id: <id value>[, $db: <database name>] }

<collectionname> 代表引用的集合的名称。
<id value> 所引用的文档的_id值。
<database name> 引用的文档所在的数据库的名称。($db是可选的)
```

```javascript
var address = [
	{ 
    "building" : "22 A, Indiana Apt", 
    "pincode" : 123456.0, 
    "city" : "Los Angeles", 
    "state" : "California"
	},
	{ 
    "building" : "170 A, Acropolis Apt", 
    "pincode" : 456789.0, 
    "city" : "Chicago", 
    "state" : "Illinois"
	}
];

db.address.insert(address[0]);
db.address.insert(address[1]);
```

DBRef 实现引用：

```javascript
var user = {
	"contact": "987654321",
	"dob": "01-01-1991",
	"name": "Aidan",
  "address": [
	  {
	    "$ref": "address",
	    "$id": ObjectId("583ae1841d8c406de26888a7"), 
	    "$db": "test"
	  },
	  {
	    "$ref": "address",
	    "$id": ObjectId("583ae1841d8c406de26888a8"), 
	    "$db": "test"
	  }
	]
};

db.user.insert(user);
```

node.js 实现检索：[参考文档](http://mongodb.github.io/node-mongodb-native/api-generated/db.html?&_ga=1.264578314.448028222.1479456236#dereference)

```javascript
var user = db.user.findOne({"name":"Aidan"});
var dbRef = user.address;

var address = [];
db.dereference(dbRef, function(error, item){
	address.push(item);
});
console.log(address);
```

## 4.3 DBRefs vs 手动引用

考虑这样的一个场景，我们在不同的集合中 (address_home, address_office, address_mailing, 等)存储不同的地址（住址，办公室地址，邮件地址等）。

这样，我们在调用不同地址时，也需要指定集合，一个文档从多个集合引用文档，我们应该使用 DBRefs。

# 5 嵌套关系型 VS 引用关系型

目前为止，我们看过了嵌套关系型和引用关系型两种使用子文档的方式，但是，慢着，嵌套关系型和引用关系型的区别是什么？它们最大的区别似乎在于麻烦程度——嵌套文档可以直接使用子文档中的数据，而引用则要先解引用，然后才能获取子文档的数据。它们对待其他文档(子文档)的方式不同，于是它们获取获取子文档数据的方式也不同。
 
先来看嵌套，当我们将一个子文档，比如 address 数组(它本身也可以是一个单独的文档)嵌套于 user 文档时， address 文档其实和 user 文档是一体的，其实它们是一个文档，它们的数据储存在一起。
 
而对于引用，当你取出一个包含引用的文档时，文档里面的 DBRef 对象不会被解开，你取出的是一个包含 DBRef  对象的子文档。而那些 DBRef 对象所指向的文档，它们是独立的一个个文档，从某个角度来看，和这个文档没有任何关系。因此，当你对 DBRef 执行解引用的时候，你需要一次额外的查询。

继续讨论我们上面的例子：

当用嵌套关系存储用户和用户地址时，我们要检索出用户 Aidan 的所有住址，我们直接使用下面的语句检索就 OK。

```javascript
db.user.findOne({"name": "Aidan"}, {"address": 1})
```

当执行上面的语句时，MongoDB 会根据 name 查找 user 文档，它在数据库内部苦苦找寻，然后，终于找到了你所需的文档。于是 MongoDB 就将文档返回给你，因为整个 user 文档包括 name 数据域和 address 数据域都放在一起，所以，执行这个文档只需要一次数据库查询，嗯，就是这样。

当用引用关系存储用户和用户地址时，我们要检索出用户 Aidan 的所有住址，我们第一步得先检索出 user 文档中的 DBRef；然后通过 db.dereference()（node.js） 函数解引用。

```javascript
var user = db.user.findOne({"name":"Aidan"});
var dbRef = user.address;

var address = [];
db.dereference(dbRef, function(error, item){
	address.push(item);
});
console.log(address);
```

你的老朋友 MongoDB（现在你们应该很熟悉了）接到你的查询任务，然后开始在数据库再次苦苦寻找，然后，终于找到你需要的文档，于是，MongoDB 返回这个文档。
 
寻找这个文档也只需要一次数据库查询（暂时和嵌套文件一样)，但是，请注意，这个文档和之前的嵌套文档不同，它包含的不是你所需要的数据，而是 DBRef 对象，两个 DBRef 对象分别储存了如何去找到相应的地址文档的信息，但它们本身还不是你所找的数据。
 
“嘿，我们有 dereference 函数，可以用它进行解引用”，我猜你在这么想——你说得对，我们可以对 user 文档里的 address 数据域中的两个 DBRef 文档进行解引用：

```javascript
db.dereference(dbRef, function(error, item){
	address.push(item);
});
```

然后，慢着，在解引用的过程中，发生了什么呢？
 
首先，MongoDB 接到第一个 DBRef 文件，上面指名我们所找的文档的 id 和 集合，于是乎，MongoDB 就根据这个地址，去帮我们搜索相应 id 的文档，它苦苦找寻，终于发现了文档，于是，它将文档返回给你，这个过程需要一个数据库查询。
 
然后，MongoDB 接到第二个 DBRef 文件，上面又有一个新地址，于是 MongoDB 根据这个地址又开始查找，一阵搜索之后，它又找到了文档，并返回给你，这个过程又需要一个数据库查询。
 
最终，你使用引用的文档获得了和嵌套文档一样的数据，但引用链接的文档使用了 3 次数据库查询（一次 user 文档，两次 address 文档，而嵌套文档只使用 1 次数据库查询。

这时候，我们差不多该下结论说，为了最大效率地使用数据库，你应该尽可能地使用嵌套而不是引用来设计你的 MongoDB 文档，因为每次解引用都会带来一次额外的搜索，它的速度比使用嵌套的文档慢的多(取决于解引用的次数)。

>
>参考文档：
>
>[MongoDB 关系](http://www.runoob.com/mongodb/mongodb-relationships.html)
>
>[MongoDB 数据库引用](http://www.runoob.com/mongodb/mongodb-database-references.html)
>
>[mongodb 文档的嵌入和引用](http://www.ttlsa.com/mongodb/embedding-referencing-information-in-documents/)
>
>[MongoDB数据库关系表示和设计——嵌套文档和引用链接](http://www.dataguru.cn/article-3805-1.html)
>