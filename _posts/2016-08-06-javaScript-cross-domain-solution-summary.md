---
layout: post
title: "【总结】JavaScript 跨域解决方案总结"
date: 2016-08-06 15:41
tags: javascript
category: web
author: Aidan
---

JavaScript 跨域解决方案总结

# 1 什么是跨域

JavaScript 出于安全方面的考虑，不允许跨域调用其他页面的对象。但在安全限制的同时也给注入 iframe 或是 ajax 应用上带来了不少麻烦。首先什么是跨域，简单地理解就是因为JavaScript同源策略的限制， a.com 域名下的 javascript 无法操作 b.com 或是 c.a.com 域名下的对象。更详细的说明可以看下表：

|URL															|说明						|是否允许通信	|
|http://www.a.com/a.js <br/> http://www.a.com/b.js  			|同一域名下					|允许			|
|http://www.a.com/lab/a.js <br/> http://www.a.com/script/b.js	|同一域名下不同文件夹		|允许			|
|http://www.a.com:8000/a.js <br/> http://www.a.com/b.js	        |同一域名，不同端口			|不允许			|
|http://www.a.com/a.js <br/> https://www.a.com/b.js				|同一域名，不同协议			|不允许			|
|http://www.a.com/a.js <br/> http://70.32.92.74/b.js			|域名和域名对应ip			|不允许			|
|http://www.a.com/a.js <br/> http://script.a.com/b.js			|主域相同，子域不同			|不允许			|
|http://www.a.com/a.js <br/> http://a.com/b.js					|同一域名，不同二级域名（同上）| 不允许（cookie这种情况下也不允许访问）|
|http://www.cnblogs.com/a.js <br/> http://www.a.com/b.js	    |不同域名					|不允许			|

特别注意两点：

- （1）如果是协议和端口造成的跨域问题“前台”是无能为力的

- （2）在跨域问题上，域仅仅是通过“URL的首部”来识别而不会去尝试判断相同的ip地址对应着两个域或两个域是否在同一个ip上。

“URL的首部”指window.location.protocol + window.location.host，也可以理解为“Domains, protocols and ports must match”。

# 2 解决方案

## 2.1 JSONP

原理是：动态插入script标签，通过script标签引入一个js文件，这个js文件载入成功后会执行我们在url参数中指定的函数，并且会把我们需要的json数据作为参数传入。

由于同源策略的限制， XmlHttpRequest 只允许请求当前源（域名、协议、端口）的资源，为了实现跨域请求，可以通过script标签实现跨域请求，然后在服务端输出 JSON 数据并执行回调函数，从而解决了跨域的数据请求。

优点是兼容性好，简单易用，支持浏览器与服务器双向通信。缺点是只支持GET请求。

JSONP：json + padding（内填充），顾名思义，就是把 JSON 填充到一个盒子里

`具体参见我的另一篇博文`: [说说 JSON 和 JSONP，也许你会豁然开朗](/archives/json-and-jsonp)

## 2.2 CORS

服务器端对于CORS的支持，主要就是通过设置Access-Control-Allow-Origin来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问。

`具体参见我的另一篇博文`: [AJAX POST & 跨域解决方案 - CORS](/archives/AJAX-POST-and-CORS)

## 2.3 window.name

### 2.3.1 window.name 跨域原理简介

window.name 传输技术，原本是 [Thomas Frank](http://www.thomasfrank.se/about.html) 用于解决 cookie 的一些劣势（每个域名 4 x 20 Kb 的限制、数据只能是字符串、设置和获取 cookie 语法的复杂等等）而发明的（详细见原文：[《Session variables without cookies》](http://www.thomasfrank.se/sessionvars.html)），后来 [Kris Zyp](http://www.sitepen.com/blog/2008/07/22/windowname-transport/) 在此方法的基础上强化了 window.name 传输 ，并引入到了 [Dojo](http://dojotoolkit.org/) （[dojox.io.windowName](http://bugs.dojotoolkit.org/ticket/6893)），用来解决跨域数据传输问题。

window.name 的美妙之处：**name 值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）**。

window.name 传输技术的基本原理和步骤如下图：

![window.name 传输技术的基本原理和步骤](/asset/images/writing/2016-08-06-javaScript-cross-domain-solution-summary/001.jpg)

name 在浏览器环境中是一个全局 window 对象的属性，且当在 frame 中加载新页面时，name 的属性值依旧保持不变。通过在 iframe 中加载一个资源，该目标页面将设置 frame 的 name 属性。此 name 属性值可被顶层窗口被获取到，从而可以访问 到 不同域 server 发送的信息。

在最顶层，name 属性是不安全的，对于所有后续页面，设置在 name 属性中的任何信息都是可获得的。

### 2.3.2 Web 服务器如何提供 window.name 数据？

为了让 Web 服务器实现 window.name，服务器应该只寻找请求中是否包含 windowname 参数。如果包含了 windowname 参数，服务器应该返回一个设置了 window.name 字符串值的 HTML 文档，回应此请求并传送到客户端。例如：

```
http://www.planabc.net/getdata.html?windowname=true
```

如果服务器想用 Hello 响应客服端，它应该返回一个 HTML 页面：

```html 
<html>
    <script type="text/javascript">
        window.name="Hello";
    </script>
</html>
```

同样也可以传输 JSON 、HTML/XML 等类型的数据。

### 2.3.3 window.name 传输技术的一些优势

- （1）它是相对安全的。也就是说，它和其他的基于安全传输的 frame 一样安全，例如 Fragment Identifier messaging （FIM）和 [Subspace](http://research.microsoft.com/~helenw/papers/subspace.pdf)。
	- Frames 也有他们自己的安全问题，由于 frame 可以改变其他 frame 的 location，但是这个是非常不同的安全溢出，通常不太严重。

- （2）它比 FIM 更快，因为它不用处理小数据包大小的 Fragment Identifier ，并且它不会有更多的 IE 上的“机关枪”声音效果。它也比 Subspace 快，Subspace 需要加载两个 Iframe 和两个本地的 HTML 文件来处理一个请求。window.name 仅需要一个 Iframe 和一个本地文件。

- （3）它比 FIM 和 Subspace 更简单和安全。FIM 稍微复杂，而 Subspace 非常复杂。Subspace 也有一些额外的限制和安装要求，如预先声明所有的目标主机和拥有针对若干不同特殊主机的 DNS 入口。window.name 非常简单和容易使用。

- （4）它不需要任何插件（比如 Flash）或者替代技术（例如 Java）。

> 跨域解决方案之 window.name 大部分摘自（部分有改动）
>
>[怿飞（圆心）：使用 window.name 解决跨域问题](http://www.planabc.net/2008/09/01/window_name_transport/)

## 2.4 window.postMessage

### 2.4.1 window.postMessage 简介

window.postMessage 是一个用于安全的使用跨源通信的方法。通常，不同页面上的脚本只在这种情况下被允许互相访问，当且仅当执行它们的页面所处的位置使用相同的协议（通常都是 http ）、相同的端口（ http 默认使用80端口）和相同的主机（两个页面的 document.domain 的值相同）。 在正确使用的情况下， window.postMessage  提供了一个受控的机制来安全地绕过这一限制。

window.postMessage 的功能是允许程序员跨域在两个窗口 iframes 间发送数据信息。基本上，它就像是跨域的 AJAX ，但不是浏览器跟服务器之间交互，而是在两个客户端之间通信。让我们来看一下 window.postMessage 是如何工作的。除了 IE6、IE7 之外的所有浏览器都支持这个功能。

[web 骇客：postMessage 的实例](http://www.webhek.com/demo/window-postmessage-api/)

### 2.4.2 实现 postMessage

#### 2.4.2.1 数据发送端

首先我们要做的是创建通信发起端，也就是数据源“ source ”。作为发起端，我们可以open一个新窗口，或创建一个 iframe ，往新窗口里发送数据，简单起见，我们每6秒钟发送一次，然后创建消息监听器，从目标窗口监听它反馈的信息。

```javascript
//弹出一个新窗口
var domain = 'http://scriptandstyle.com';
var myPopup = window.open(domain 
            + '/windowPostMessageListener.html','myWindow');

//周期性的发送消息
setInterval(function(){
	var message = 'Hello!  The time is: ' + (new Date().getTime());
	console.log('blog.local:  sending message:  ' + message);
        //send the message and target URI
	myPopup.postMessage(message,domain);
},6000);

//监听消息反馈
window.addEventListener('message',function(event) {
	if(event.origin !== 'http://scriptandstyle.com') return;
	console.log('received response:  ',event.data);
},false);
```

这里我使用了 window.addEventListener ，但在 IE 里这样是不行的，因为 IE 使用 window.attachEvent 。如果你不想判断浏览器的类型，可以使用一些工具库，比如 jQuery 或 Dojo 。

假设你的窗口正常的弹出来了，我们发送一条消息——需要指定URI(必要的话需要指定协议、主机、端口号等)，消息接收方必须在这个指定的 URI 上。如果目标窗口被替换了，消息将不会发出。

我们同时创建了一个事件监听器来接收反馈信息。有一点极其重要，你一定要验证消息的来源的URI！只有在目标方合法的情况才你才能处理它发来的消息。

如果是使用 iframe ，代码应该这样写：

```javascript
//捕获iframe
var domain = 'http://scriptandstyle.com';
var iframe = document.getElementById('myIFrame').contentWindow;

//发送消息
setInterval(function(){
	var message = 'Hello!  The time is: ' + (new Date().getTime());
	console.log('blog.local:  sending message:  ' + message);
        //send the message and target URI
	iframe.postMessage(message,domain); 
},6000);
```

确保你使用的是 iframe 的 contentWindow 属性，而不是节点对象。

#### 2.4.2.2 数据接收端

下面我们要开发的是数据接收端的页面。接收方窗口里有一个事件监听器，监听“message”事件，一样，你也需要验证消息来源方的地址。消息可以来自任何地址，要确保处理的消息是来自一个可信的地址。

```javascript
//响应事件
window.addEventListener('message',function(event) {
	if(event.origin !== 'http://davidwalsh.name') return;
	console.log('message received:  ' + event.data,event);
	event.source.postMessage('holla back youngin!',event.origin);
},false);
```

上面的代码片段是往消息源反馈信息，确认消息已经收到。下面是几个比较重要的事件属性：

source – 消息源，消息的发送窗口 iframe 。
origin – 消息源的 URI (可能包含协议、域名和端口)，用来验证数据源。
data – 发送方发送给接收方的数据。

这三个属性是消息传输中必须用到的数据。

### 2.4.3 安全性

跟其他很web技术一样，如果你不校验数据源的合法性，那使用这种技术将会变得很危险；你的应用的安全需要你对它负责。 window.postMessage 就像是 PHP 相对于 JavaScript 技术。 window.postMessage 很酷，不是吗？

> window.postMessage 摘自（ 部分有改动）

> 1 [MDN: window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
> 
>2 [web 骇客: 用HTML5里的window.postMessage在两个网页间传递数据](http://www.webhek.com/window-postmessage-api/)

## 2.5 CSS Text Transformation

新技术，围观请到 github 项目：[王集鹄（zswang）：CSS Text Transformation](https://github.com/zswang/csst)

原理图：

![CSS Text Transformation 的基本原理和步骤](/asset/images/writing/2016-08-06-javaScript-cross-domain-solution-summary/002.jpg)

## 2.6 修改 document.domain 来跨子域

将子域和主域的document.domain设为同一个主域。

前提条件：

- 这两个域名必须属于同一个基础域名!
- 而且所用的协议，端口都要一致，否则无法利用document.domain进行跨域

主域相同的使用document.domain