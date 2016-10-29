---
layout: post
title: "【转载】AJAX POST & 跨域解决方案 - CORS"
date: 2016-08-06 14:52
tags: ajax
category: web
author: Aidan
---

当传输大量的数据时，GET形式搞不定（[JSONP](/archives/json-and-jsonp) 只支持 GET），于是闻名已久的CORS（跨域资源共享，Cross-Origin Resource Sharing）便要上场了。。。

# 1 概述

## 1.1 CORS能做什么

正常使用 AJAX 会需要正常考虑跨域问题，所以伟大的程序员们又折腾出了一系列跨域问题的解决方案，如 JSONP、flash、ifame、xhr2 等等。

本文介绍的CORS就是一套AJAX跨域问题的解决方案。

## 1.2 CORS的原理

CORS 定义一种跨域访问的机制，可以让 AJAX 实现跨域访问。CORS  允许一个域上的网络应用向另一个域提交跨域 AJAX 请求。实现此功能非常简单，只需由服务器发送一个响应标头即可。

## 1.3 CORS 浏览器支持情况

如下图:

![CORS 浏览器支持情况](/asset/images/writing/2016-08-06-AJAX-POST-and-CORS/001.jpg)

![CORS 浏览器支持情况](/asset/images/writing/2016-08-06-AJAX-POST-and-CORS/002.jpg)

喜闻乐见、普大喜奔的支持情况，尤其是在移动终端上，除了opera Mini；

PC上的现代浏览器都能友好的支持，除了IE9-，不过前端工程师对这种情况早应该习惯了...

# 2 CORS 启航

假设我们页面或者应用已在 `http://www.test1.com` 上了，而我们打算从 `http://www.test2.com` 请求提取数据。一般情况下，如果我们直接使用 AJAX 来请求将会失败，浏览器也会返回“`源不匹配`”的错误，"`跨域`"也就以此由来。

利用 CORS，`http://www.test2.com` 只需添加一个标头，就可以允许来自 `http://www.test1.com` 的请求，下图是我在 PHP 中的 hander() 设置，“*”号表示允许任何域向我们的服务端提交请求：

```php
header("Access-Control-Allow-Origin: *");
```

也可以设置指定的域名，如域名 `http://www.test2.com` ，那么就允许来自这个域名的请求：

```php
header("Access-Control-Allow-Origin: http://www.test2.com");
```

当前我设置的header为“*”，任意一个请求过来之后服务端我们都可以进行处理 & 响应，那么在调试工具中可以看到其头信息设置，其中见红框中有一项信息是 “Access-Control-Allow-Origin：* ” ，表示我们已经启用 CORS。

简单的一个header设置，一个支持跨域 & POST 请求的 server 就完成了:)

# 3 问题 & 小结

- 刚刚说到的兼容性。CORS是W3C中一项较新的方案，所以部分浏览器还没有对其进行支持或者完美支持，详情可移至 [http://www.w3.org/TR/cors/](http://www.w3.org/TR/cors/)

- 安全问题。CORS提供了一种跨域请求方案，但没有为安全访问提供足够的保障机制，如果你需要信息的绝对安全，不要依赖 CORS 当中的权限制度，应当使用更多其它的措施来保障，比如 OAuth2。

自认为的cors使用场景：

- cors 在移动终端支持的不错，可以考虑在移动端全面尝试；PC上有不兼容和没有完美支持，所以小心踩坑。当然浏览器兼容就是个伪命题，说不准某个浏览器的某个版本就完美兼容了，说不准就有点小坑，尼玛伤不起！～

- jsonp 是 get 形式，承载的信息量有限，所以信息量较大时 CORS 是不二选择；

- 配合新的 JSAPI(fileapi、xhr2 等)一起使用，实现强大的新体验功能。

参考资料:

- [http://www.w3.org/TR/cors/](http://www.w3.org/TR/cors/)

- [http://www.html5rocks.com/en/tutorials/cors/](http://www.html5rocks.com/en/tutorials/cors/)

- [http://caniuse.com/#search=cors](http://caniuse.com/#search=cors)

>原文
>
>[Darren_聂微东: AJAX POST&跨域 解决方案 - CORS](http://www.cnblogs.com/Darren_code/p/cors.html)