---
layout: post
title:  "【总结】css 处理工具总结"
date: 2016-06-01
categories: css
tags: less sass scss compass postcss
keyword: "css 处理工具总结，less sass scss compass postcss"
author: Aidan
---

css 处理工具很多让人不知道选哪个好了，今天抽空总结下目前常见的 css 处理工具。

## less

github 项目地址: [less: https://github.com/less/less.js](https://github.com/less/less.js)

学习资料：[less 中文网](http://lesscss.cn/)

>Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。

>Less 可以运行在 Node 或浏览器端。

## sass 

学习资料：[w3cplus: sass入门 - sass教程](http://www.w3cplus.com/sassguide/)

>Sass 是对 CSS 的扩展，让 CSS 语言更强大、优雅。 它允许你使用变量、嵌套规则、 mixins、导入等众多功能， 并且完全兼容 CSS 语法。 Sass 有助于保持大型样式表结构良好， 同时也让你能够快速开始小型项目， 特别是在搭配 Compass 样式库一同使用时。

注：sass Ruby 语言开发，所以要安装 Ruby

### sass 与 scss 的异同

>SCSS 是 Sass 3 引入新的语法，其语法完全兼容 CSS3，并且继承了 Sass 的强大功能。也就是说，任何标准的 CSS3 样式表都是具有相同语义的有效的 SCSS 文件。另外，SCSS 还能识别大部分 CSS hacks（一些 CSS 小技巧）和特定于浏览器的语法，例如：古老的 IE filter 语法。

>由于 SCSS 是 CSS 的扩展，因此，所有在 CSS 中正常工作的代码也能在 SCSS 中正常工作。也就是说，对于一个 Sass 用户，只需要理解 Sass 扩展部分如何工作的，就能完全理解 SCSS。大部分扩展，例如变量、parent references 和 指令都是一致的；唯一不同的是，SCSS 需要使用分号和花括号而不是换行和缩进。 例如，以下这段简单的 Sass 代码：

>```sass
#sidebar
  width: 30%
  background-color: #faa
```

>只需添加花括号和分号就能转换为 SCSS 语法：

>```scss
#sidebar {
  width: 30%;
  background-color: #faa;
}
```

>另外，SCSS 对空白符号不敏感。上面的代码也可以书写成下面的样子：

>```scss
#sidebar {width: 30%; background-color: #faa}
```

>还有一些不同是比较复杂的。请参考[其他复杂差异](http://sass.bootcss.com/docs/scss-for-sass-users/#nested-selectors)

### compass

>简单说，Compass是Sass的工具库（toolkit）。

>Sass本身只是一个编译器，Compass在它的基础上，封装了一系列有用的模块和模板，补充Sass的功能。它们之间的关系，有点像Javascript和jQuery、Ruby和Rails、python和Django的关系。

参见: [阮一峰：Compass用法指南](http://www.ruanyifeng.com/blog/2012/11/compass.html)

## postcss

>PostCSS是一个JS插件转换样式表的工具。这些插件能够检验你的CSS、支持变量和混合，转化css3的新特性语法、行内图片等。

>其中一个比较为人所知的插件AutoPrefixer就是出自这里，目前上面已经超过200多个插件在github。

参见: [PostCSS：用JS插件转换样式的工具](http://www.ruanyifeng.com/blog/2012/11/compass.html)

教程：[PostCSS](http://www.w3cplus.com/blog/tags/516.html)

总结的比较简单，但最后还是想说一下如何选择性地学习新的技术，就拿 css 处理工具来说，应该先具体了解都有各自的哪些特点，简单对比那个更适合自己；当然更重要的就是我们学技术也要解耦，尽量在已有的基础上扩展，由技术向工程靠拢，我们最终的技术是要服务于具体的工程项目的，所以一定要评估成本。对于学技术来说就是花费的事件。所以一定要解耦，不要把自己带入无尽的技术深渊，而在工程上的收获并不丰盛。

同时要时时刻刻的准备着学些，技术永远不会停下来等你！我们要做的就是评估成本，努力做一个技术的追赶着；同时要在工程上更有建树。