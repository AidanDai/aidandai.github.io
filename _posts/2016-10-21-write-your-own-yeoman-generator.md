---
layout: post
h1: "share & note"
description: "The worst pen is better than the best memory!"
header-img: "./asset/image/blog/blog-bg-001.jpg"

title: 写一个你自己的 yeoman 生成器
type: 【整理】
category: web
tags: yeoman

keyword: yeoman gulp webpack react

author: Aidan
date: 2015-10-21
---

由于自己经常会写一些 demo，或者学习新工具库的使用，然后又比较依赖 npm 的模块管理（这个是重点）和 webpack 的代码打包功能，所以每次都要创建一个目录结构，复制各种 .rc 文件，复制 webpack 的配置文件，复制一个应用了 webpack dev 中间件的 express server，每次都要这样，让我心里很烦。

我一直知道 yeoman 这个东西，不过找不到自己喜欢的 generator，简单浏览过 generator 的文档，感觉很麻烦，不易上手，就一直没学。最近在新的项目组，我又定义了一套开发的目录规范，为了给自己提供开发上的便利，于是决定好好学写 Yeoman Generator。

本文将介绍一个基本的 Yeoman Generator 的写法，并分享一些开发中的注意点。

# 1、搭建开发环境

（1）安装 node.js 和 npm

[node.js](https://nodejs.org/en/)

[npmjx](https://www.npmjs.com/)

[npm 入门教程](https://github.com/theicebear/npm-basic-usage)

（2）安装 yeoman 

```
npm install -g yo
```

# 2 yeoman 简介

简单介绍下 Yeoman，它是一个脚手架生成工具，比如在之前写 ASP.NET MVC 的时候，Visual Studio 会给你选模板，然后生成一个项目的基本结构（脚手架），这对提升开发体验是很有帮助的，节省了重复劳动。然而前端没有什么 IDE（WebStorm？或许吧），没有一个固定的开发模式，可能你喜欢 jshint，我想用 eslint，你觉得 angular 顺手，我觉得 vue 更合适，这时就可以使用 Yeoman 这个工具，生成一个 适合自己技术栈 的脚手架，需要的一些文件都预先生成好，给自己省点事。

而 Yeoman Generator 则定义了一个脚手架应该如何生成，所以我们可以去 这个网站 找适合自己的 Generator，如果没有的话，就自己动手吧。

然后这里是安装和使用的命令，不具体介绍它的使用了，想学的话可以去 它的[官网(http://yeoman.io/)](http://yeoman.io/) 看看。

```
npm install -g yo
npm install -g generator-angular

yo angular
```

自己的需求
先说下自己的需求吧，我希望它可以：

- 满足自己的技术栈：express、webpack、react、babel、eslint、travis
- 自动生成并安装依赖
- 灵活性，即可以生成一个适合写 demo 的小脚手架，也可以生成一个 WebApp 的复杂脚手架，同时，在需要的时候可以只生成一份 .babelrc
- 组合性，多个脚手架可以组合，可复用
- 很高兴的是，Yeoman 完全可以实现我的需求。

# 3 开始写 Yeoman Generator 了

Yeoman 给我们提供了一个用来写脚手架的脚手架 [generator-generator](https://github.com/yeoman/generator-generator)，我们可以从它开始。

由于生成出来的项目依赖 nsp 服务，我在 npm prepublish 阶段的时候发生了域名解析错误的问题，如果遇到了类似的问题，就把 package.json 里的 prepublish 删掉吧。

假设我要写一个 Generator 叫做 Butler（管家的意思），那么，根据 Yeoman 的规定，你需要将这个 node 模块的名字命名为 generator-*，所以我命名为 generator-butler，如果你是通过 generator-generator 生成的目录结构，那么可以进入到 generator-butler 目录中，运行 npm link，就可以开始使用你的 Generator 啦。