---
layout: post
title: "【笔记】End-to-end and Hop-by-hop Headers"
date: 2016-07-20 10:12
tags: http
category: http
author: Aidan
---

For the purpose of defining the behavior of caches and non-caching proxies, we divide HTTP headers into two categories:
为了去定义代理服务器缓存和不缓存的行为，我们将 HTTP 头部分为两类：

	- End-to-end headers, which are  transmitted to the ultimate recipient of a request or response. End-to-end headers in responses MUST be stored as part of a cache entry and MUST be transmitted in any response formed from a cache entry.
	- 端到端头部，它将作为请求或响应头部的一部分被发送到最终的接收者。端到端头部在响应中必须作为 a cache entry 的一部分被缓存，并且必须在任意来自 a cache entry 的响应中被传输。

    - Hop-by-hop headers, which are meaningful only for a single transport-level connection, and are not stored by caches or forwarded by proxies.
    - 逐跳头部，它仅仅意味着一个单一的传输层连接，不需要被代理缓存或发送。

The following HTTP/1.1 headers are hop-by-hop headers:
下面是 HTTP/1.1 头部中的逐跳头部：

	- Connection
	- Keep-Alive
	- Proxy-Authenticate
	- Proxy-Authorization
	- TE
	- Trailers
	- Transfer-Encoding
	- Upgrade

All other headers defined by HTTP/1.1 are end-to-end headers.
其他所有 HTTP/1.1 定义的头部都是端到端头部。

Other hop-by-hop headers MUST be listed in a Connection header, (section 14.10) to be introduced into HTTP/1.1 (or later).（没看名是什么意思）
[14.10 章节](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.10)

原文：

[w3c: https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.5.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.5.1)

补充：

>搜狗百科：端到端是网络连接。网络要通信，必须建立连接，不管有多远，中间有多少机器，都必须在两头（源和目的）间建立连接，一旦连接建立起来，就说已经是端到端连接了，即端到端是逻辑链路，这条路可能经过了很复杂的物理路线，但两端主机不管，只认为是有两端的连接，而且一旦通信完成，这个连接就释放了，物理线路可能又被别的应用用来建立连接了。TCP就是用来建立这种端到端连接的一个具体协议，SPX也是。

[搜狗百科：端到端](http://baike.sogou.com/v37218110.htm?fromTitle=%E7%AB%AF%E5%88%B0%E7%AB%AF)