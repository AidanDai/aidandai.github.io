---
layout:     post
title:      gulp and browser-syns 搭建 jekyll 博客
subtitle:   搭建一流的前端开发工作流，让效率更高
date:       2015-07-02 23:00
author:     Aidan
header-img: /assets/images/writing/2016-07-02-jekyll-gulp-browser-sync/post-bg.jpg
thumbnail: /assets/images/writing/thumb01.png
tags: [gulp, browser-syns, jekyll]
category: 项目经验
comments: true
---

最近听了[太阁：https://www.bittiger.io/ 或 http://cn.bittiger.io/](https://www.bittiger.io/)（ps：你懂的）的`冯沁原`老师的几节课，深受启发。对学习方法又有了深刻的认识，改变应该从此刻开始。于是迈出了坚实的第一步整理博客，沉淀知识。当然也是受到[【太阁X】第十期：聊聊技术博客的那些事儿](https://www.bittiger.io/blog/post/nExgw7Gp6pYgH68wu)的启发。至于以前的博客自己会慢慢整理到新站点上，把知识也重新规整一下。

## 1、先来聊聊怎么写技术博客

### 1.1、写博客的好处

- 对技术的了解更深入
- 被约稿，能挣钱
- 技术名片，交到志同道合的朋友
- 记录自己的成长

等等。。。。。。

### 1.2、写博客的四个境界

- 自身价值：找到好工作，开阔自身视野
- 积累沉淀：自身技术总结
- 融入交流：融入技术圈，与大牛交流
- 成就他人：改变行业，引领时代方向。如：雷军，傅盛
写博客的过程

### 1.3、博客内容

博客应该一种分享和兴趣，把自己的事业发表出来。应该有深度的分析，关注问题之间的联系。同时，博客应该坚持原创，有自己的观点。最后，应该坚持下去。

### 1.4、写作工具

- 格式肯定首选markdown，这个没有什么好说的

### 1.5 写一篇好博客

- 先以笔记的形式记录

	- (1)、 问题导向，发现问题
	- (2)、 分析解决，持续改进
	- (3)、 总结提升

- 把笔记升华为博客

	- 要有图，一图胜千言。
	- 以问题为中心(what,why,how)
	- 层次段落要清晰(标题，子标题，章节)
	- 突出中心(记录解决问题、如何解决而非记录解决问题花费的功夫),节约读者时间

示例：[什么是Counting Bloom Filter？](http://blog.csdn.net/jiaomeng/article/details/1498283)

这个示例博文最大的亮点是图，纯文字的部分只有短短一两百字，但把Counting Bloom Filter清晰地用图画了出来，然后用几个公式介绍概率是如何计算的，最后把论文的链接列出来，很方便读者阅读。

### 1.6、发布平台

- CSDN：号称“全球最大中文IT社区”
- oschina：开源中国。是目前中国最大的开源技术社区。
- SegmentFault：更像一个问答社区。
- github:可以直接新建一个repo，然后上传自己的博客。（ps: 很多大牛是这么干的）

github pages 搭建个小站，可以用常用博客引擎（jekyll、Octopress、Hexo）生成个静态站点；在github上基于jekyll搭建个人博客可以我的另一篇笔记[在github上基于jekyll搭建个人站点 - By Aidan]()

啰嗦一句，自己最开始在`51CTO`写过博客,在`CSDN`写过，还在自己大学团队的博客网站上写过，各种限制让人感觉很不爽，于是自己就搭建了`github pages`。

## 2、using gulp and browser-syns for jekyll

jekyll搭建完毕跑起来后，为了有个自己喜欢的`theme`不得不找个还不错的主题来改改，或者自己重写个，怎么搭建起自动化的工作流呢？

自己谷歌了下，发现有个哥们[Vladimir Iakovlev： Add live reloading to Jekyll with Gulp and Browsersync](https://nvbn.github.io/2015/06/19/jekyll-browsersync/)跟我遇到了同样的问题。 虽然已经有人探索出了方法，但我在次总结记录下。（ps: 谁叫我记性不好呢）

从纯净的`jekyll`开始

### 2.1、安装依赖模块

```bash
npm init

// webpack
npm install webpack --save-dev

// babel-loader and plugins
npm install babel-loader babel-preset-es2015 babel-preset-stage-0 --save-dev

// gulp
npm install gulp --save-dev

// gulp plugins
npm install gulp-rename del --save-dev

// postcss
npm install gulp-postcss --save-dev

// postcss plugins
npm install precss autoprefixer --save-dev

// jekyll-search
npm install simple-jekyll-search --save
```

至于每个模块的功能，github 一下你就知道你（访问 github 上该项目主页）；

当然你可以一次安装所有依赖

### 2.2、webpack 、gulp 和 jekyll 配置

明天补上
