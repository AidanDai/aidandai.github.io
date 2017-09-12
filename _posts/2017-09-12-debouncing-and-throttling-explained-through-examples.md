---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: 通过例子来解释函数防抖(debounce)和函数节流(throttle)
type: 【翻译】
category: web

tags: debounce throttle

keyword: 通过例子来解释函数防抖(debounce)和函数节流(throttle)

author: Aidan
date: 2017-09-12
---

>
> 原文: [David Corbacho: Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
>
> 译者: [Aidan](https://github.com/AidanDai)
>

以下是 David Corbacho 的客座邮件，David Corbacho 是一位来自伦敦的前端开发工程师。我们以前[已经讨论过这个话题了](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)，但是这次，David 将通过互动的例子去讲解它们，通过互动的例子使得它们的概念更清楚。

函数防抖和函数节流是两个相似的去控制某个函数在一段被允许执行多少次的技术，但它们的本质确是不同的。

当我们将函数注册到特定的 DOM 的事件上时，这时候函数防抖和函数节流将特别有用。为什么这么说呢？因为我们在事件和函数的执行之间加了一层自己的控制，请记住，我们不能控制这写 DOM 事件被触发的频率，它是变化的。

让我么来聊聊 scroll 事件吧，请看下面这个例子：

<iframe id="cp_embed_PZOZgB" src="//codepen.io/dcorb/embed/PZOZgB?height=257&amp;theme-id=1&amp;slug-hash=PZOZgB&amp;default-tab=result&amp;user=dcorb" scrolling="no" frameborder="0" height="257" allowtransparency="true" allowfullscreen="true" name="CodePen Embed" title="CodePen Embed 7" class="cp_embed_iframe " style="width: 100%; overflow: hidden; height: 250px"></iframe>

当我们通过触摸触控板，滚动滚轮或者拖动滚动条时很容易美秒触发30多次 scroll 事件，而且在测试中，当慢慢滚动滚动条时每秒可能触发多达100个 scroll 事件。您的滚动事件处理函数准备好以这个速率执行了吗？

在 2011, Twitter 网站出了一个问题：当您向下滚动您的 Twitter Feed 时，它变的非常慢并且失去了响应。John Resig 发表了[一篇关于这个问题的博客](https://johnresig.com/blog/learning-from-twitter/)，在博客里他解释了直接将昂贵的功能附加到滚动事件是多么糟糕一个想法。

John（五年前的那个时候）的建议解决方案是在 onScroll 事件之外每 250ms 运行一次循环。这样处理程序变没有耦合到事件。通过这种简单的技术，我们可以避免破坏用户体验。

现在处理事件的方法稍微复杂一些。让我介绍一下 Debounce，Throttle 和 requestAnimationFrame。我们还会查看匹配的用例。

# Debounce

函数防抖技术允许你将多个顺序触发的事件绑定函数合并成一个。

![Debounce](../asset/image/blog/2017-09-12-debouncing-and-throttling-explained-through-examples/001.webp)

想像一下你在电梯里。电梯门即将关闭，这时候突然另一个人试图进去。电梯还没有改变它的楼层，电梯门再一次打开了。现在这件事又发生在了另一个人身上。电梯在延迟执行它的功能（移动楼层），这样它就优化了资源。

可以自己试一下，点击 `Trigger area` 的按钮或者在按钮内移动鼠标。

<iframe id="cp_embed_KVxGqN" src="//codepen.io/dcorb/embed/KVxGqN?height=391&amp;theme-id=1&amp;slug-hash=KVxGqN&amp;default-tab=result&amp;user=dcorb" scrolling="no" frameborder="0" height="391" allowtransparency="true" allowfullscreen="true" name="CodePen Embed" title="CodePen Embed 6" class="cp_embed_iframe " style="width: 100%; overflow: hidden; height: 380px;"></iframe>

可以看到多个快速被触发的顺序事件被一个 `debounced event` 代表，而且如果这些被触发的事件间隔事件较久，去抖动将不会发生。

# Leading edge (or "immediate")