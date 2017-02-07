---
layout: post
h1: "share & note"
description: "The worst pen is better than the best memory!"
header-img: "./asset/image/blog/blog-bg-001.jpg"

title: 浅析 ThinkJS 中 RESTful API 的设计
type: 【原创】
category: web 应用架构设计
tags: Think.js RESTful

keyword: Think.js RESTful

author: Aidan
date: 2016-10-09
---

本文简单分析一下 Think.js 中 RESTful API 的设计。

# 1 ThinkJS 中的 RESTful API

## 1.1 官方文档

[ ThinkJS 官网：REST API](https://thinkjs.org/zh-cn/doc/2.2/rest_api.html)

官方文档介绍的比较简单。大家可以参考我整理的 [关于 RESTful 的小知识：理解 RESTful]()。

## 1.1.1 处理请求

官方文档中是这样解释的：

> # 处理 REST API 请求
>
>Rest Controller 创建完成后，无需写任何的代码，即可完成对 REST API 的处理。资源名称和数据表名称是一一对应的，如：资源名为 ticket，那么对应的数据表为 数据表前缀 + ticket。

个人理解这样的说法并不妥当，尤其是`资源名称和数据表名称是一一对应的`；关于资源的理解请参考我整理的 [关于 RESTful 的小知识：自己动手设计 RESTful API]() 中的具体解释。

## 1.1.2 权限管理

官方文档中是这样解释的：

># 权限管理
>
>有些 REST API 需要进行权限验证，验证完成后才能获取对应的信息，可以通过在 __before 魔术方法里进行验证。

```javascript
export default class extends think.controller.rest {
  * __before(){
    let auth = yield this.checkAuth();
    if(!auth){
      return this.fail("no permissions"); //没权限时直接返回
    }
  }
}
```

乍一看，在 ThinkJS 中涉及到的权限验证是基于 Cookie 的验证机制；而且很简单。但我在继续了解 ThinkJS 的 Middleware 后发现我越来越糊涂了，又不明白怎么去实现权限验证了。

[ ThinkJS 官网：Middleware](https://thinkjs.org/zh-cn/doc/2.2/middleware.html)

># hook 列表
>
>框架里包含的 hook 列表如下：
>
>request_begin 请求开始
>payload_parse 解析提交上来的数据
>payload_validate 验证提交的数据
>resource 静态资源请求处理
>route_parse 路由解析
>logic_before logic 处理之前
>logic_after logic 处理之后
>controller_before controller 处理之前
>controller_after controller 处理之后
>view_before 视图处理之前
>view_template 视图文件处理
>view_parse 视图解析
>view_filter 视图内容过滤
>view_after 视图处理之后
>response_end 请求响应结束
>
>每个 hook 里调用多个 middleware 来完成处理，具体包含的 middleware 如下：
<<<<<<< HEAD
>
>```javascript
>export default {
>  request_begin: [],
>  payload_parse: ["parse_form_payload", "parse_single_file_payload", "parse_json_payload", "parse_querystring_payload"],
>  payload_validate: ["validate_payload"],
>  resource: ["check_resource", "output_resource"],
>  route_parse: ["rewrite_pathname", "parse_route"],
>  logic_before: [],
>  logic_after: [],
>  controller_before: [],
>  controller_after: [],
>  view_before: [],
>  view_template: ["locate_template"],
>  view_parse: ["parse_template"],
>  view_filter: [],
>  view_after: [],
>  response_end: []
>};
>```

ThinkJS 中的 hook 列表，看到这里我真是一脸懵逼。框架中默认 hook 列表 的执行顺序（PS：貌似无法直接调整hook 列表的执行顺序，只能编辑和选择性执行 hook）让人无法理解。如果要设计 RESTful API，`hook 中为什么会把 route_parse 放在后面，而把 payload_parse、payload_validate 和 resource 放在前面；这样如何进行权限管理，怎么实现对资源的浏览、创建、更新、删除呢？`，这样的处理流程怎么设计 RESTful API 呢？
=======

```javascript
export default {
  request_begin: [],
  payload_parse: ["parse_form_payload", "parse_single_file_payload", "parse_json_payload", "parse_querystring_payload"],
  payload_validate: ["validate_payload"],
  resource: ["check_resource", "output_resource"],
  route_parse: ["rewrite_pathname", "parse_route"],
  logic_before: [],
  logic_after: [],
  controller_before: [],
  controller_after: [],
  view_before: [],
  view_template: ["locate_template"],
  view_parse: ["parse_template"],
  view_filter: [],
  view_after: [],
  response_end: []
};
```

ThinkJS 中的 hook 列表，看到这里我真是一脸懵逼。框架中默认 hook 列表 的执行顺序（PS：貌似无法直接调整hook 列表的执行顺序，只能编辑和选择性执行 hook）让人无法理解。如果要设计 RESTful API，**hook 中为什么会把 route_parse 放在后面，而把 payload_parse、payload_validate 和 resource 放在前面；这样如何进行权限管理，怎么实现对资源的浏览、创建、更新、删除呢？**，这样的处理流程怎么设计 RESTful API 呢？
>>>>>>> refs/remotes/origin/master
