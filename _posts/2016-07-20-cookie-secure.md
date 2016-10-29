---
layout: post
title: "【转载】cookie 安全漫谈"
date: 2016-07-20 14:26
tags: cookie
category: http
author: Aidan
---

在Web应用中，Cookie很容易成为安全问题的一部分。从以往的经验来看，对Cookie在开发过程中的使用，很多开发团队并没有形成共识或者一定的规范，这也使得很多应用中的Cookie成为潜在的易受攻击点。在给Web应用做安全架构评审（Security architecture review）的时候，我通常会问设计人员以下几个问题：

- `你的应用中，有使用JavaScript来操作客户端Cookie吗？如果有，那么是否必须使用JavaScript才能完成此应用场景？如果没有，你的Cookie允许JavaScript来访问吗？`

- `你的网站（可能包含多个Web应用）中，对于Cookie的域（Domain）和路径（Path）设置是如何制定策略的？为何这样划分？`

- `在有SSL的应用中，你的Cookie是否可以在HTTP请求和HTTPS请求中通用？`

在实际的应用场景中，Cookie被用来做得最多的一件事是保持身份认证的服务端状态。这种保持可能是基于会话（Session）的，也有可能是持久性的。不管哪一种，身份认证Cookie中包含的服务端票据（Ticket）一旦泄露，那么服务端将很难区分带有此票据的用户请求是来自于真实的用户，或者是来自恶意的攻击者。在实际案例中，造成Cookie泄露最多的途径，是通过跨站脚本（XSS, Cross Site Script）漏洞。攻击者可以通过一小段JavaScript代码，偷窃到代表用户身份的重要的Cookie标示。由于跨站脚本漏洞是如此的普遍（不要以为简单的HTML Encode就可以避免被跨站，跨站是一门很深的学问，以至于在业界衍生出一个专用的名词：跨站师），几乎每一个网站都无法避免，所以这种方式是实际攻防中被普遍使用的一种手段。

避免出现这种问题的首要秘诀就是尽所有的可能，给你的Cookie加上HttpOnly的标签。HttpOnly的具体使用不在本文的讨论范围内，否则作者略有骗InfoQ稿酬的嫌疑。一个大家所不太熟悉的事实是，HttpOnly是由微软在2000年IE6 Sp1中率先发明并予以支持的。截止现在，HttpOnly仍然只是一个厂商标准，但是在过去的十余年中，它得到了众多浏览器的广泛支持。

下表是OWASP整理的关于主流浏览器对HttpOnly支持情况的一个总结。目前主流的浏览器，除了Android之外，几乎都无一例外对这一属性予以了支持。

当然对于中国开发者来说，需要考虑的问题更加复杂一些：在这个神奇的地方，有大量的用户使用的浏览器并不在以下的列表中，他们使用的是以下面浏览器中的一种或者数种为内核的“精装版”浏览器。这些浏览器厂商对于同源策略、HttpOnly Cookie、证书管理等安全规范的支持情况，有待于进一步调查。


在我看来，一个Web应用的每一个Cookie都应该带上HttpOnly的标签。我没有看到这个决定可能带来的负面作用，如果一定要说有的话，那么就是你的应用将不能再通过JavaScript来读写Cookie了。可是这真有必要吗？个人认为，JavaScript操作Cookie是一种不正常的做法；可以用JavaScript操作Cookie完成的功能，一样可以用服务端响应Http头设置Cookie来完成。相反，设置所有的Cookie为HttpOnly带来的巨大好处则非常明显：尽管你需要继续修复XSS漏洞，但是这些漏洞至少暂时不会让你的用户遭受大规模的账户损失。

关于Cookie的第二个话题是域设置。

浏览器在选择发送哪些本地Cookie到本次请求的服务端时，有一系列的比较和甄别。这些甄别中最重要的部分是Domain和Path的吻合。Domain形如.abc.com的Cookie，会被发送给所有abc.com在80端口上的子域请求。但是反之则不行，这就是Cookie的域匹配（domain match）原则。

在一个大型Web站点中，往往有多个应用，生存在不同的子域名或路径下。这些应用之间由于共享同一个域名，所以往往可能会彼此有操作对方应用Cookie的能力。这种情况下，设计好Cookie的Domain和Path尤为重要。在实际设计工作中，最重要的一个安全原则就是：最小化授权。这意味着，你需要将自己的Cookie可被访问到的范围降至最低。应用之间传递数据和共享信息的解决方案非常多，而通过Cookie这种用户输入（User input）来共享数据，是最不安全的解决方案之一。

Cookie另外一个不太常被使用的属性是Secure. 这个属性启用时，浏览器仅仅会在HTTPS请求中向服务端发送Cookie内容。如果你的应用中有一处非常敏感的业务，比如登录或者付款，需要使用HTTPS来保证内容的传输安全；而在用户成功获得授权之后，获得的客户端身份Cookie如果没有设置为Secure，那么很有可能会被非HTTPS页面中拿到，从而造成重要的身份泄露。所以，在你的Web站点中，如果使用了SSL，那么你需要仔细检查在SSL的请求中返回的Cookie值，是否指定了Secure属性。

除此之外还值得特别指出的是，一些Web应用除了自己的程序代码中生成的Cookie，往往还会从其他途径生成一些Cookie。例如由Web Server或者应用容器自动生成的会话Cookie，由第三方库或者框架生成的Cookie等等。这些都需要进行有针对性的加固处理。

几乎每个站点都难以离开Cookie，但Cookie的使用因其貌似简单，而很容易被人轻视。重新审视应用中的Cookie代码，几乎只需要很小的代价就可以获得巨大的安全收益。

参考文章：
[http://en.wikipedia.org/wiki/HTTP_cookie](http://en.wikipedia.org/wiki/HTTP_cookie)
[https://www.owasp.org/index.php/HttpOnly](https://www.owasp.org/index.php/HttpOnly)

>原文：
>
>[殷钧钧: Cookie安全漫谈](http://www.infoq.com/cn/articles/cookie-security)

