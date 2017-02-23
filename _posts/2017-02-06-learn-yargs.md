---
layout: post
h1: "share & note"
description: "The worst pen is better than the best memory!"
header-img: ".../asset/image/blog/blog-bg-001.jpg"

title: yargs 学习笔记
type: 【整理】
category: node.js

tags: command

keyword: node command

author: Aidan
date: 2017-02-06
---

以往写脚本语言最火的是python和shell，随着nodejs逐渐强大起来，前端工程师也能写一些有用的工具帮助提升开发效率，当然，喜欢写工具的都是懒人，我也不除外。

* TOC
{:toc}

有很多强大的命令行框架，比如[shelljs](https://github.com/shelljs/shelljs), [commander.js](https://github.com/tj/commander.js), [node-optimist](https://github.com/substack/node-optimist)。这两个框架都很出名，也是平常用的最多的两个框架，但今天我想给大家介绍另一个比较普通的框架yargs。

- `shelljs` Portable Unix shell commands for Node.js
- `commander.js` [README](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)
- `node-optimist` Light-weight option parsing for node.js

# 1 Node.js 命令行简介

## 1.1 可执行脚本

首先，使用 JavaScript 语言，写一个可执行脚本 hello 。

```bash
#!/usr/bin/env node
console.log('hello world');
```

然后，修改 hello.js 的权限。

```bash
$ chmod 755 hello.js
```

现在，hello 就可以执行了。

```bash
$ ./hello.js
hello world
```

如果想把 hello 前面的路径去除，可以将 hello 的路径加入环境变量 PATH。但是，另一种更好的做法，是在当前目录下新建 package.json ，写入下面的内容。

```json
{
  "bin": {
    "test": "./hello.js"
  }
}
```

然后执行 npm link 命令。

```bash
$ npm link
```

现在再执行 hello ，就不用输入路径了。

```bash
$ test
hello world
```

# 2 yargs 简介

yargs 是一个比较轻量级的框架，它能够满足大多数命令行操作，也可以使用它的api来实现一个复杂的操作。 接下来我会写一个类似mkdir -p的工具(可以递归创建文件夹)，然后根据下面的步骤去建立一个npm包并且发布。