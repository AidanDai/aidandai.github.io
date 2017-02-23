---
layout: post
h1: "share & note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: ubuntu 16.04 安装 Google Chrome dev
type: 【整理】
category: linux

tags: ubuntu linux

keyword: ubuntu linux 安装 Google-Chrome-dev

author: Aidan
date: 2016-12-21
---

ubuntu 公司估计和 Google 公司有些许不同意见，直接使用 apt-get ，还是图形软件中心都无法找到 Chrome 浏览器。所以下面记录下我是如何安装 Chrome dev 的。

* TOC
{:toc}

由于本身没有将下载源加入到系统的源列表。那么我们手动加上。

```bash
// 将下载源加入到系统的源列表
sudo wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
```

如果返回“地址解析错误”等信息，可以百度搜索其他提供 Chrome 下载的源，用其地址替换掉命令中的地址。

继续在终端中，输入以下命令：

```bash
// 导入谷歌软件的公钥，用于下面步骤中对下载软件进行验证
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub  | sudo apt-key add - 
```

如果顺利的话，命令将返回“OK”；然后继续在终端中，输入以下命令：

```bash
sudo apt-get update // 用于对当前系统的可用更新列表进行更新
```

最后在终端中，输入以下命令：

```bash
sudo apt-get install google-chrome-unstable // 执行对谷歌 Chrome 浏览器（开发版）的安装
```

在终端中执行以下命令，运行谷歌 Chrome 浏览器（开发版）

```bash
google-chrome-unstable
```

将会启动谷歌 Chrome 浏览器，它的图标将会出现在屏幕左侧,右键图标锁定到启动器即可。