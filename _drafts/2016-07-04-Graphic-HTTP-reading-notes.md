---
layout:     post
title:     《图解 HTTP》读书笔记
subtitle:   快速全面的了解 HTTP
date:       2015-07-04 22:32
author:     Aidan
header-img: /assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/post-bg.jpg
thumbnail: /assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/thumb01.png
tags: [http]
category: 读书
comments: true
---

[TOC]

# 1 了解 Web 及网络基础

## 1.1 TCP/IP 的分层管理

- 应用层（决定用户提供应用服务时的通信活动，example: FTP HTTP）

- 传输层（example: TCP UDP）

- 网络层（网络互联层，example: IP）

- 链路层（数据链路层、网络接口层）

## 1.2 Web TCP/IP 通信传输流

![Web TCP/IP 通信传输流1](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/001.png)

![Web TCP/IP 通信传输流2](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/002.png)

## 1.3 三次握手

![三次握手](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/003.png)

## 1.4 URI(统一资源标识符)/URL(统一资源定位符)

- 绝对 URI 格式

http://user:pass@www.example.com:80/home/index.html?uid=1#ch

协议方案名：`http:`

认证信息：`user:pass`

服务器地址：`www.example.com`

服务器端口号：`80`

带层次的文件路径：`/home/index.html`

查询字符串：`uid=1`

片段标识符：`ch`

# 2 简单的 HTTP 协议 

## 2.1 HTTP 无状态协议

请求响应不做持久化处理（不保存之前一切的请求或响应报文的信息）

## 2.2 告知服务器意图的 HTTP 方法

- GET	获取资源
- POST 	传输实体主体
- PUT 	传输文件（`FTP`上传文件）
- HEAD 	获取报文首部（类似GET，但不能返回报文主题；用于确认URI的有效性及资源更新情况）
- DELETE	删除文件
- OPTIONS	询问支持方法
- TRACH		追踪路径（确认连接过程中的一系列操作；易引发`XST(Cross-Site Tracing,跨站追踪)`攻击）
- CONNECT	要求用隧道协议连接代理
	- 要求与代理服务器通信时建立隧道，实现用隧道协议进行`TCP`通信
	- 使用`SSL(Secure Sockets Layer,安全套接层)`和`TLS(Transport Layer Security,传输层安全协议)`把通信内容加密后经网络通信传输

## 2.3 持久连接节省通信量

- 未持久连接

![未持久连接](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/004.png)

![未持久连接](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/005.png)

- 持久连接

![持久连接](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/005.png)


## 2.4 管线化

- 同时并行发送多个请求

![管线化](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/007.png)

## 2.5 使用 Cookie 的状态管理

![Cookie 的状态管理](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/008.png)

# 3 HTTP 报文内的 HTTP 信息

## 3.1 HTTP 报文

![报文结构1](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/009.png)

![报文结构2](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/010.png)

![报文结构3](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/011.png)

- 请求行：请求方法 + URI + HTTP版本
- 状态行：响应结果状态码 + 原因短语 + HTTP版本
- 首部字段：请求响应的各种条件和属性的各类首部
	- 通用首部
	- 请求首部
	- 响应首部
	- 实体首部
- 其他：HTTP和RFC里未定义的首部（Cookie等）

## 3.2 编码提升传输速率

提高传输速率，但计算机会消耗更多的CPU等资源

### 3.2.1 报文（message）和实体（entity）

- message: 真实的 HTTP 报文
- entity: 编码后的 HTTP 报文

### 3.2.2 压缩传输的内容编码

![内容编码](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/012.png)

内容编码：
	- gzip(GNU zip)
	- compress(UNIX 系统的标准压缩)
	- deflate(zlib)
	- identify(不进行编码)

### 3.2.3 分割发送的分块传输编码

![分块传输编码](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/013.png)

## 3.3 发送多种数据的多部分对象集合

![多部分对象集合](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/014.png)

多部分对象集合包含的对象：
- multipart/form-data: 表单文件上传
- multipart/byteranges: 响应报文包含多个范围的内容是使用

![multipart/form-data](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/015.png)

![multipart/byteranges](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/016.png)

## 3.4 获取部分内容的范围请求（Range Request）

![Range Requert](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/017.png)

## 3.5 内容协商返回最适合的内容

- 服务器驱动协商（server-driven Negotiation）: 浏览器决定
- 客户端驱动协商（Agent-driven Negotiation）: 用户决定
- 透明协商（Transparent Negotiation）: 浏览器 + 用户

# 4 返回结果的 HTTP 状态码

## 4.1 状态码分类

||类别|原因短语|
|:-----|:-----|:-----|
|1xx|Informational(信息性状态码)|接受请求正在处理|
|2xx|Success(成功状态码)|请求正常处理完毕|
|3xx|Redirection(重定向状态码)|需要进行附加操作以完成请求|
|4xx|Client Error(客户端错误状态码)|服务器无法处理请求|
|5xx|Server Error(服务器错误状态码)|服务器处理请求出错|

## 4.2 常见状态码

### 4.2.1 2xx

- 200 OK
- 204 No Content
- 206 Partial Content

### 4.2.2 3xx

- 301 Moved Permanently 更新引用书签
	- http://www.example.com/sample 301 结尾缺少 '/'
- 302 Found 临时重定向
- 303 See Other
- 304 Not Modified
- 307 Temporary Redirect 临时重定向

### 4.2.3 4xx

- 400 Bad Request 报文错误
- 401 Unanthorized 认证
- 403 Forbidden 禁止访问
- 404 Not Found 未找到资源

### 4.2.4 5xx

- 500 Internal Server Error 执行请求错误
- 503 Service Unavalible 暂时无法处理请求

# 5. 与 HTTP 协作的 Web 服务器

## 5.1 Virtual Host

- Host 首部内完整指定主机名或域名的 URI

## 5.2 代理、网关、隧道

### 5.2.1 代理：中间人

![代理](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/018.png)

- 缓存代理（Caching Proxy）：预先将资源的副本缓存在代理服务器上
- 透明代理（Transparent Proxy）：不对报文做任何加工

### 5.2.2 网关：中转站

![网关](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/019.png)

- 提高通信安全性

### 5.2.3 隧道

![隧道](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/020.png)

## 5.3 保存资源的缓存

![缓存](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/021.png)

## 5.3.1 缓存的有效期

![缓存的有效期](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/022.png)

- 缓存服务器
- 客户端 

（ps: 缓存服务器 订阅 源服务器）

# 6 HTTP 首部

## 6.1 HTTP 首部字段

### 6.1.1  4种 HTTP 首部字段类型

- 通用首部字段（General Header Fields）：请求报文和响应报文都会使用的首部

|首部字段名|说明|
|:-----|:------|
|Cache-Control|控制缓存的行为|
|Connection|逐跳首部、连接的管理|
|Date|创建报文的日期和时间|
|Progma|报文指令|
|Trailer|报文末端的首部一览|
|Tranfer-Encoding|指定报文主体的传输编码方式|
|Upgrade|升级为其他协议|
|Via|代理服务器的相关信息|
|Warning|错误通知|
|||

- 请求首部字段（Request Header Fields）

|首部字段名|说明|
|:-----|:------|
|Accept|用户代理可处理的媒体类型|
|Accept-Charset|优先的字符集|
|Accept-Language|优先的自然语言|
|Authorization|Web 认证信息|
|Expert|期待服务器的特定行为|
|From|用户的电子邮箱地址|
|Host|请求资源所在服务器|
|If-Match|比较实体标记（Etag）|
|If-Modified-Since|比较资源的更新时间|
|If-None-Match|比较实体标记（与 If-Match 相反）|
|If-Range|资源未更新是发送实体Byte的请求范围|
|If-Unmodified-Since|比较资源的更新时间（与If-Modified-Since相反）|
|Max-Forwards|最大传输逐跳数|
|Proxy-Authorization|代理服务器要求客户端的认证信息|
|Range|实体字节范围要求|
|Referer|对请求中URI的原始获取方|
|TE|传输编码的优先级|
|User-Agent|HTTP 客户端程序的信息|


- 响应首部字段（Response Header Fields）

|首部字段名|说明|
|:-----|:------|
|Accept-Ranges|是否接受字节范围请求|
|Age|推算资源创建经过的时间|
|Etag|资源的匹配信息|
|Location|令客户端重定向至指定URI|
|Proxy-Authenticate|代理服务器对客户端的认证信息|
|Retry-After|对再次发起请求的时间要求|
|Server|HTTP服务器的安装信息|
|Vary|代理服务器缓存的管理信息|
|WWW-Authenticate|服务器对客户端的认证信息|

- 实体首部字段（Entity Header Fields）：针对请求报文和响应报文的实体部分使用的首部

|首部字段名|说明|
|:-----|:------|
|Allow|资源可支持的HTTP方法|
|Content-Encoding|资源主体适用的编码方式|
|Content-Language|实体主体的自然语言|
|Content-Length|实体主体的大小（字节）|
|Content-Location|替代资源对应的URI|
|Content-MD5|实体主体的报文摘要|
|Content-Range|实体主体的位置范围|
|Content-Type|实体主体的媒体类型|
|Expires|实体主体过期的日期时间|
|Last-Modified|资源最后的修改日期|

### 6.1.2 非 HTTP/1.1 首部字段

RFC4299 HTTP Header Fields Registrations

Cookie、Set-Cookie 和 Content-Disposition 等

### 6.1.3 End-to-end 首部 和 Hop-by-hop 首部

- 端到端首部（End-to-end）
	- 如果缓存此类别中的首部必须被缓存
	- 必须被转发（起、源）

>分类在此类别中的首部会转发给请求/响应对应的最终接收目标，且必须保存在有缓存生成的响应中，另外规定它必须被转发

- 逐跳首部
	- 单次转发有效，会因缓存或代理而不在转发
	- 如果要使用hop-to-hop首部，需提供Connection首部字段

```
Connection
Keep-Alive
Proxy-Authenticate
Proxy-Authorization
Trailer
TE
Transfer-Encoding
Upgrade
```

## 6.2 HTTP/1.1 通用首部字段

### 6.2.1 Cache-Control

![Cache-Control](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/023.png)

- Cache-Control 指令一览

![Cache-Control 缓存请求指令](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/024.png)

![Cache-Control 缓存响应指令](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/025.png)

#### 6.2.1.1 表示能否缓存的指令

- public/private

```
Cache-Control: public
```

```
Cache-Control: private
```

![public/private](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/026.png)

- no-cache

```
Cache-Control: no-cache
```

![no-cache](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/027.png)

#### 6.2.1.2 控制可执行缓存的对象指令

- no-store

```
Cache-Control: no-store
```

注：no-cache 代表不缓存过期的资源；no-store 代表不进行缓存

#### 6.2.1.3 指令缓存期限和认证的指令

- s-maxage

```
cache-control: s-maxage=604800 // 单位：秒
```

（1）和 max-age 指令相同，它们的不同点是 s-maxage 只适用于多位用户使用的公共缓存服务器（也就是说，向同一用户重复发送响应的服务器来说，这个指令没有任何作用）（2）当使用 s-maxage 指令后，则直接忽略点对 Expires 首部字段及  max-age 指令的处理（也就是 s-maxage 的优先级高）

- max-age

```
cache-control: max-age=604800  // 单位：秒
```

![max-age](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/028.png)

HTTP/1.1 中优先处理 max-age ，而忽略掉 Expires 首部字段（HTTP/1.0 恰好相反）

- min-fresh 

```
cache-control: min-fresh=60 // 单位：秒
```

![min-fresh](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/029.png)

min-fresh 指令要求缓存服务器返回至少还未过指定时间的缓存

- max-stale

```
cache-control: max-stale=3600  // 单位：秒
```

max-stle 可指示规定时间的资源都有效，无论是否过期

- only-if-cache

```
cache-control: only-if-cache
```

使用 only-if-cache 指令表示客户端仅在缓存服务器本地缓存目标存在的情况下才会要求其返回（即该指令要求缓存服务器不重新加载响应，不会再次确认资源的有效性。）若发生请求缓存服务器的本地缓存无响应，则返回状态码 504 Gateway Timeout

- must-revalidate

```
cache-control: must-revalidate
```

（1）使用 must-revalidate 指令，代理会向服务器再次验证即将返回的响应缓存目前是否仍然有效（2）若代无法联通源服务器源再次获取有效资源，缓存必须给客户端一条 504 （Gateway Timeout）状态码（3）使用 must-revalidate 指令会忽略请求的 max-stale 指令

- proxy-revalidate

```
cache-control: proxy-revalidate
```

proxy-revalidate 指令要求所有缓存服务器在接收到客户端带有该指令的请求返回响应之前，必须再次验证缓存的有效性

- no-tranform

```
cache-control: no-tranform
```

使用 no-transform 指令规定无论在请求还是响应中，缓存都不能改变实体主体的媒体类型（防止缓存或代理压缩图片等类似操作）

#### 6.2.1.4 cache-control 扩展

```
cache-control: private, community="UCI"
```

通过 cache-extension 标记（token），可扩展 cache-control 首部字段内的指令。如上例，cache-control 首部字段本身没有 community 这个 指令。借助extension tokens 实现了该指令的添加（extension tokens 仅对能理解它的缓存服务器来说是有意义的）

### 6.2.2 connection

connection 字段首部具备如下两个作用

- 控制不在转发给代理的首部字段
- 管理持久连接

#### 6.2.2.1 控制不在转发给代理的首部字段

![控制不在转发给代理的首部字段](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/030.png)

```
connection: 不在转发的首部字段名
```

#### 6.2.2.2 管理持久连接

![管理持久连接](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/031.png)

```
connection: close
```

（1）HTTP/1.1 版本的默认连接都是持久连接。当服务器想明确断开连接时，则指定 connection 首部字段的值为 close。（2）HTTP/1.1 之前的版本的默认连接都是非持久化的。为此如果想在旧版本的 HTTP 协议 上维持持久连接，则需指定 connection 首部字段的值为 keep-alive。

如下图所示客户端发送请求给服务器时，服务器会向上图那样加上首部字段 keep-alive 及首部字段 connection 后返回响应。

![keep-alive](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/032.png)

```
connection: keep-alive
```

### 6.2.3 date 

首部字段 date 表明创建 HTTP 报文的日期和时间

### 6.2.4 pragma

pragma 是 HTTP/1.1 之前版本的历史遗留字段，仅作为与 HTTP/1.0 的向后兼容而定义。

```
pragma: no-cache
```

该首部字段属于通用首部字段，但只在客户端发送的请求中。客户端会要求所有的中间服务器不返回缓存的资源。

![pragma](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/033.png)

兼容服务器 HTTP 协议版本

```
cache-control: no-cache
pragma: no-cache
```

### 6.2.5 trailer

![trailer](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/034.png)

首部字段 trailer 会事先说明在报文主体后记录了哪些首部字段。该首部字段可应用在 HTTP/1.1 版本分块传输编码时。

![trailer](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/035.png)

以上用例中，指定首部字段 trailer 的值为 expires，在报文主体之后（分块长度0之后）出现了首部字段 expires。

### 6.2.6 tranfer-encoding

![ranfer-encoding](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/036.png)

（1）规定报文主体传输时采用的编码方式（2）HTTP/1.1 的传输编码方式仅对分块传输编码有效

![ranfer-encoding](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/037.png)

以上用例中，正如首部字段 transfer-encoding 中指定的那样，有效使用分块传输编码。

### 6.2.7 upgrade

![upgrade](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/038.png)

（1）询问服务器是否支持字段指定的通信方法及相应版本（2） upgrade 首部字段产生作用的 upgrade 对象仅限于客户端和临接服务器之间。因此，使用它时，还需要额外指定 connection: upgrade。（3）对于附有 upgrade 首部字段的请求，服务器可用 101 switch protocols 状态码作为响应返回。

### 6.2.7 via

![via](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/039.png)

（1）via 用于追踪客户端与服务器之间的请求和响应报文的传输路径
（2）报文经过代理和网关时，会先在首部字段 via 中附加该服务器的信息，然后在进行转发。（3）via 还可以避免请求回环的发生（4）via 首部是为了追踪传输路径，所以经常会和 trace 方法一起使用。

### 6.2.8 warning

HTTP/1.1 的 warning 首部都是从 HTTP/1.0 响应首部（retry-after）演变过来的。该首部通常会告知用户一些与缓存相关的警告问题 。

![warning](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/040.png)

warning 首部的格式：

![warning-format](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/041.png)

HTTP/1.1 中的7钟警告：（警告内容仅供参考，警告码可扩展）

![warning-content](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/042.png)

## 6.3 请求首部字段

请求首部字段是从客户端往服务器发送请求报文中所使用的字段，用于补充请求的附加信息、客户端信息、对响应内容相关的优先级等内容。

![请求首部字段](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_140853.png)

### 6.3.1 accept

![accept](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/043.png)

```
accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

（1）accept 字段可通知服务器，用户代理能够处理的媒体类型及媒体类型的优先级。可使用 type/subtype 这种形式，一次指定多种媒体类型。（2）使用 q= 来额外表示权重值，用分号 ; 进行分隔。权重值 q 的范围是 0~1 （可精确到小数点后3位），且1为最大值。默认 q=1.0 。

### 6.3.2 accept-charset

![accept-charset](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/044.png)

```
accept-charset: ios-8859-5, unicode-1-1;q=0.8
```

### 6.3.3 accept-encoding

![accept-encoding](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_123915.png)

```
accept-encoding: gzip, deflate
```

### 6.3.4 accept-language

![accept-language](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_124426.png)

```
accept-language: zh-cn,zh;q=0.7,en-us,en,q=0.3
```

### 6.3.5 authorization

![authorization](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_124706.png)

```
authorization: basic dwvubdfds3545vdd6e4jdfiu==
```

（1）首部字段 authorization 是用来告知服务器，用户代理的认证信息（证书值）。（2）通常，想要通过服务器认证的用户代理会在接收到返回的401状态码响应后，把首部字段 authorization 加入请求中。（3）公用缓存在接收到含有 authorization 首部字段的请求时的操作处理会略有差异。

### 6.3.6 except

![except](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_125248.png)

```
accept: 100-continue
```

### 6.3.7 from 

![from](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_130018.png)

```
from: aidandai@126.com
```

### 6.3.8 host

![host](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_130038.png)

```
host: www.aidandai.com
```

（1）首部字断 host 会告知服务器，请求的资源所处的互联网主机名和端口号。host 首部字段在 HTTP/1.1 规范内是唯一一个必须被包含在请求内的首部字段。（2）首部字段 host 用来识别单台服务器分配多个域名的虚拟主机。

### 6.3.9 if-match

![if-match](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_130606.png)

形如 if-xxx 这种样式的请求首部字段，都可以为条件请求。服务器接收到附带条件请求后，只有在条件为真实，才会执行请求。

![if-match](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_130717.png)

```
if-match: "123456"
```

（1）首部字段 if-match ，属附带条件之一，它会告知服务器匹配资源所用的实体标记（Etag）值。这时服务器无法使用若 Etag 值。（2）服务器会比对 if-match 的字段值和资源的 Etag 值，今当两者一致时，才会执行请求。反之，则返回状态码 412 Precondition failed 的响应。（3）还可以使用 * 指定 if-match 的字段值。针对这种情况，服务器将会忽略 Etag 的值，只要资源存在就处理请求。

### 6.3.10 if-modified-since

![if-modified-since](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_132852.png)

```
if-modified-since: Thu, 15 Apr 2004 00:00:00 GMT
```

（1）在 if-modified-since 字段值的日期时间之后，如果请求的资源都没有更新过，则返回状态码 304 not modified 的响应 （2） if-modified-since 用于确认代理或客户端拥有的本地资源的有效性。获取时间的更新日期时间，可通过确认首部字段 last-modified 来确定。

### 6.3.11 if-none-match

![if-none-match](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_133504.png)

### 6.3.12 if-range

![if-range](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_133621.png)

![if-range](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_134008.png)

### 6.3.13 if-unmodified-since

```
if-unmodified-since: Thu, 03 Jul 2012 00:00:00 GET
```

首部字段 if-unmodified-since 和首部字段 if-modified-since 的作用相反。（2）如果在指定日期时间后发生了更新，则以状态码 412 precondition failed 作为响应返回。

### 6.3.14 max-forwards

![max-forwards](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_134517.png)

```
max-forwards: 10 
```

通过 trace 方法或 options 方法，发送包含首部字段 max-forwards 的请求时，该字段以十进制整数形式正定可以经过的服务器数目。服务器在往下一个服务器转发请求之前， max-forwards 的值减1后重新赋值。当服务器接收到 max-forwards 值为0时，则不再进行转发，而是直接返回响应。（2）可以灵活使用首部字段 max-forwards 调查请求失败的情况。

![max-forwards](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_135213.png)

### 6.3.15 proxy-authorization

```
proxy-authorization: basic deghgh64jjdh4fdhhj6
```

接受到从代理服务器发来的认证质询时，客户端会发送包含首部字段 proxy-authorization 的请求，已告知服务器认证所需要的信息。（与客户端和服务器之间的 HTTP 访问认证相类似）

### 6.3.16 range

```
range: bytes=5001-10000
```

接收到附带 range 首部字段请求的服务器，会在处理请求之后返回状态码为 206 partial content 的响应。无法处理该范围请求时，则会返回状态码 200 OK 的响应 及全部资源。

### 6.3.17 referer

![referer](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_140050.png)

```
referer: http://www.aidandai.com/index.html
```

首部字段 referer 会告知服务器请求的原始资源的 URI。

### 6.3.18 TE 

```
TE: gzip,deflate;q=0.5
```

首部字段 TE 会告知服务器客户端能够处理响应的传输编码方式及相对优先级。

首部字段 TE 除指定传输编码之外，还可以指定伴随 trailer 字段的分块传输编码方式。

```
ET: trailers
```

### 6.3.19 user-agent

![user-agent](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_140700.png)

## 6.4 响应首部字段 

响应首部字段是由服务器向客户端返回响应报文中所使用的字段，用于补充响应的附加信息、服务器信息，以及客户端的附加要求等信息。

![响应首部字段](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_141134.png)

### 6.4.1 accept-ranges

![accept-ranges](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_141237.png)

```
accept-ranges: bytes/none
```

### 6.4.2 age

![age](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_141608.png)

若创建该响应的服务器是缓存服务器， age 值是指缓存后的响应再次发起认证到认证完成的时间值。代理创建响应时必须加上首部字段age。

### 6.4.3 ETag

![etag](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_141958.png)

（1）首部字段 etag 能够告知客户端实体标识。它是一种可将资源以自符串形式作唯一性标识的方式。服务器会为每份资源分配对应的 Etag 值。（2）当资源更新时，Etag 值也需要更新。生成 Etag 值时没有统一的算法规则，而仅仅是由服务器来分配的。

![ETag](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_142534.png)

仅仅凭借 URI 指定缓存资源是相当困难的。一般都依照 Etag 值来指定资源。

#### 强 Etag 值和弱 Etag 值

强 Etag 值，不论实体发生多么细微的变化都会改变其值。

```
Etag："usagi-1234"
```

弱 Etag 值，只用于提示资源是否相同。只有资源发生了根本改变，产生差异是才会改变 Etag 值。这时，会在字段最开始处附加 W/。

```
Etag：W/"usagi-1234"
```

### 6.4.4 location

![location](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_144259.png)

基本上，该字段会配合 3XX: redirection 的响应。提供重定向的 URI。几乎所有的浏览器在接收到包含首部字段 location 的响应后，都会强制性的尝试对已提示的重定向资源的访问。

### 6.4.5 proxy-authenticate

```
proxy-authenticate: basic realm="usagidesign auth"
```

首部字段 proxy-authenticate 会把由代理服务器所要求的认证信息发送给客户端。（与首部字段 WWW-authorization 有着相同的作用）。

### 6.4.6 retry-after

![retry-after](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_145015.png)

首部字段 retry-after 告知客户端该在多久之后再次发送请求，主要配合状态码 503 server unavailable 响应， 或 3XX redirect 响应一起使用。字段可以指定具体日期，也可以是创建响应后的秒数。

### 6.4.7 server

![server](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_145148.png)

首部字段 server 告知客户端当前服务器上安装的 HTTP 服务器应用程序的信息。不单单会标出服务器上的软件应用名称，还有可能包括版本号和安装是启用的可选项。

![server](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_145910.png)


### 6.4.8 vary

![vary](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_145255.png)

### 6.4.9 WWW-authorization

![WWW-authorization](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_150226.png)

首部字段 WWW-authorization 用于 HTTP 访问认证。告知客户端访问资源的认证方案（basic 或是 disgest）和带参数提示的质询（chellenge）。状态码 401 unauthorized 响应中，肯定带有首部字段 WWW-authorization。

## 6.5 实体首部字段

实体首部字段是包含在请求和响应报文中的实体部分所使用的首部，用于补充内容的更新时间等与实体相关的信息。

![实体首部字段](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_150823.png)

### 6.5.1 allow

![allow](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_150908.png)

当服务器接收到不支持的 HTTP 方法时，会以状态码 405 method not allowed 作为响应返回。与此同时，还会把所有能支持的 HTTP 方法写入首部字段 allow 后返回。

### 6.5.2 content-encoding

![content-encoding](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_151238.png)

```
content-encoding: gzip
```

（1）内容编码是指在不丢失实体信息的前提下进行的压缩。（2）主要的4中内容编码方式：gzip、compress、deflate、identity

### 6.5.3 content-language

![content-language](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_151556.png)

### 6.5.4 content-length

![content-length](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_151653.png)

对实体主体进行内容编码传输时，不能再使用 content-length 首部字段。（实体主体的计算方法了略微复杂）

### 6.5.5 content-location

首部字段 content-location 给出与报文主体返回资源相对应的完整 URI。

### 6.5.6 content-md5

![content-md5](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_152259.png)

（1）首部字段 content-md5 是一串由 MD5 算法生成的二进制数，再通过 base64 编码后的值。（由于 HTTP 首部无法记录二进制值，所以要 base64 编码；这与图片资源类似）（2）content-md5 用于检查报文主体在传输过程中是否保持完整，以及确认传输到达。为了确认报文的有效性，作为接受方的客户端会对报文主体在执行一次相同的 md5 算法，然后比较后即可判断报文主体的准确性。（3）采用这种方法对在内容上的偶发性改变是无从查证的，也无法检测出恶意篡改。（因为内容如果被篡改，那么同时意味着 content-md5 也可重新计算然后被篡改）

### 6.5.7 content-range

![content-range](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_153258.png)

针对范围请求，返回响应时使用的首部字段 content-range，能告知客户端作为响应的实体的哪个部分符合范围请求。字段只可以为单位，表示当前发送部分及整个实体的大小。

### 6.5.8 content-type

```
content-type: text/html; charset=UTF-8
```

### 6.5.9 expires

![expires](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_153904.png)

首部字段 expires 会将资源失效的日期告知客户端。

### 6.5.10 last-modified

![last-modified](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_155522.png)

首部字段 last-modified 指明资源最终修改的时间。但类似 CGI 脚本进行动态数据处理事，该值有可能会变成数据最终修改的时间。

## 6.6 为 cookie 服务的首部字段

cookie 的工作机制是用户识别及状态管理。web 网站为了管理用户的状态会通过 web 浏览器，把一些数据临时写入用户的计算机内。接着当用户访问该 web 网站时，可以通过通信方式取回之前发放的 cookie。

调用 cookie 时，由于可校验 cookie 的有效期，以及发送方的域、路径、协议等信息，所以正规发布的 cookie 的数据不会因来自其他 web 站点的攻击者的攻击而泄漏。

![为 cookie 服务的首部字段](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_160811.png)

### 6.6.1 set-cookie

![set-cookie](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_160935.png)

![cookie-property](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/2016-07-16_161149.png)

- expires 
	- 省略 expires 属性时，其有效期仅限于维持浏览器会话的（session）时间段内。这通常限于浏览器应用程序被关闭之前。
	- 一但 cookie 从服务器端发送至客户端，服务器端就不存在可以显示删除 cookie 的方法。但可以通过覆盖已过期的 cookie ，实现对齐客户端 cookie 的实质性删除操作。

- path
	- cookie 的 path 属性可用于限定 cookie 的发送范围的文件目录。不过另有办法可以避开这项限制，看来对其作为安全机制的效果不能抱有期待。

- domain
	- 指定的域名可做到与结尾匹配一致。例如：当指定 example.com 后，除 example.com 以外，www.example.com 或 www2.example.com 等都可以发送 cookie。

- secure
	- 限制 web 页面 仅在 HTTPS 安全连接时，才可以发送 cookie。

指定方法如下:

```
set-cookie: name=value; secure  // 只有在 HTTPS 连接时才会进行 cookie 的回收。
```
- HttpOnly 属性
	- 使 javascript 脚本无法获的 cookie，主要为防止跨站脚本攻击（cross-site scripting, XSS）对 cookie 的信息窃取。

指定方法如下:

```
set-cookie: name=value; HttpOnly
```

通常上述设置后，从 web 页面内还可以对 cookie 进行读取操作。但使用 javasctipt 的 document.cookie 就无法读取附加 Httponly 属性后的 cookie 的内容了。故无法再 XSS 中利用 javascript 劫持 cookie 了。 

### 6.6.2 cookie

```
cookie: status=enable
```

首部字段 cookie 会告知服务器，当客户端想获得 HTTP 状态管理支持时，就会在请求中包含从服务器接受的 cookie 。接收到多个 cookie 时，同样可以以多个 cookie 形式发送。

## 6.7 其他

HTTP 字段是可以自行扩展的。所以在 web 服务器和浏览器的应用上，会出现各种非标准的首部字段。

### 6.7.1 x-frame-options




![](/assets/images/writing/2016-07-04-Graphic-HTTP-reading-notes/)



