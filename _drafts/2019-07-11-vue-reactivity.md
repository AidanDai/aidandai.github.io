---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: 深入 Vue 响应式原理
type: 【整理】
category: web
tags: Vue MVVM

keyword: Vue Vue.js MVVM

author: Aidan
date: 2019-07-11
---

本文将介绍几种常见的 MV* 模式，及 MVVM 的常见实现，并从源码层级深入分析 Vue 响应式原理，以及 Vue 响应式原理和其他 MVVM 实现的对比。

* TOC
{:toc}

# 1 MV*

> 以下介绍的 MV* 模式都是为了解决图形界面应用程序复杂性管理问题而产生的应用架构模式。

> GUI 程序所面临的问题

>图形界面的应用程序提供给用户可视化的操作界面，这个界面提供给数据和信息。用户输入行为（键盘，鼠标等）会执行一些应用逻辑，应用逻辑（application logic）可能会触发一定的业务逻辑（business logic）对应用程序数据的变更，数据的变更自然需要用户界面的同步变更以提供最准确的信息。例如用户对一个电子表格重新排序的操作，应用程序需要响应用户操作，对数据进行排序，然后需要同步到界面上。

>在开发应用程序的时候，以求更好的管理应用程序的复杂性，基于**职责分离（Speration of Duties）**的思想都会对应用程序进行分层。在开发图形界面应用程序的时候，会把管理用户界面的层次称为View，应用程序的数据为Model（注意这里的Model指的是Domain Model，这个应用程序对需要解决的问题的数据抽象，不包含应用的状态，可以简单理解为对象）。Model提供数据操作的接口，执行相应的业务逻辑。

![GUI 程序](../asset/image/blog/2019-07-11-vue-reactivity/001.png)

## 1.1 MVC

## 1.2 MVC Model 2

## 1.3 MVP

### 1.3.1 Passive View

### 1.3.2 Supervising Controller

## 1.4 MVVM

> <https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel>

# 2 Vue

# 3 对比

参考链接：

- 界面之下：还原真实的MV*模式：https://github.com/livoras/blog/issues/11

