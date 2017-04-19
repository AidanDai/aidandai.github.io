---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: jwt 详解
type: 【原创】
category: web

tags: jwt

keyword: jwt 详解

author: Aidan
date: 2017-04-16
---

之前自认为对　jwt 有所了解，直到最近被面试官一问，才知道自己的浅薄，于是才有了下面这篇文章，重新认识一下　jwt，当然仍然缺乏实践，还请各位前被多多指正。

* TOC
{:toc}

# 1 JWT 是什么？

## 1.1 JWT 简介

JWT 是一种用于双方之间传递安全信息的简洁的、URL 安全的表述性声明规范。JWT 作为一个开放的标准（ [RFC 7519](https://tools.ietf.org/html/rfc7519) ），定义了一种简洁的，自包含的方法用于通信双方之间以 JSON 对象的形式安全的传递信息。因为数字签名的存在，这些信息是可信的，JWT 可以使用 HMAC 算法或者是 RSA 的公私秘钥对进行签名。

- 简洁(Compact): 可以通过 URL，POST 参数或者在 HTTP header 中发送，因为数据量小，传输速度也很快
- 自包含(Self-contained)：负载中包含了所需要的所有用户信息，避免了多次查询数据库

## 1.2 JWT　的主要应用场景

- 身份认证(Authentication)：这是使用　JWT　最常见的情形。一旦用户完成了登陆，在接下来的每个请求中包含　JWT，可以用来验证用户身份以及对路由，服务和资源的访问权限进行验证。由于它的开销非常小，可以轻松的在不同域名的系统中传递，所有目前在单点登录（SSO）中比较广泛的使用了该技术。

- 信息交换(Information Exchange)：JSON Web Token 是一个在双方间安全传递信息的好方法，因为它们能被签名。例如：我们可以使用公私秘钥对签名，这样就可以确保发送者以及他们发送的信息的真实性。此外，当签名使用头部和有效载荷计算时，还可以验证内容未被篡改。

## 1.3 JWT 的结构

JWT包含了使用 `.` 分隔的三部分：

- Header(头部)
- Payload(负载)
- Signature(签名)

其结构看起来是这样的


```
xxxxx.yyyyy.zzzzz
```

### 1.3.1 Header

在 header 中通常包含了两部分：token 类型，也就是　`JWT`；以及采用的加密算法，例如　HMAC SHA256 或者 RSA。

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
接下来对这部分内容使用 Base64Url 编码组成了　JWT　结构的第一部分。

### 1.3.2 Payload

Token的第二部分是负载，它包含了 claim， Claim 是一些实体（通常指的用户）的状态和额外的元数据，有三种类型的 claim： reserved, public 和 private。

- Reserved claims: 这些 claim 是 JWT 预先定义的，在 JWT 中并不会强制使用它们，而是推荐使用，常用的有 iss（签发者）, exp（过期时间戳）, sub（面向的用户）, aud（接收方）, iat（签发时间）。
- Public claims：这些可以由使用 JWT 的人随意定义。但为避免冲突，应在 IANA JSON Web 令牌注册表中定义它们，或者将其定义为包含防冲突命名空间的 URI。
- Private claims：这些是为了在同意使用它们的各方之间共享信息而创建的自定义声明。

负载使用的例子：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

上述的负载需要经过 Base64Url 编码后作为 JWT 结构的第二部分。

### 1.3.3 Signature

创建签名需要使用编码后的 header 和 payload 以及一个秘钥，使用 header 中指定签名算法进行签名。例如如果希望使用 HMAC SHA256 算法，那么签名应该使用下列方式创建：

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### 1.4 完整的 JWT

JWT 格式的输出是以 `.` 分隔的三段 Base64 编码，与 SAML 等基于 XML 的标准相比，JWT 在 HTTP 和 HTML 环境中更容易传递。

下列的 JWT 展示了一个完整的 JWT 格式，它拼接了之前的 Header， Payload 以及秘钥签名：

![jwt](../asset/image/blog/2017-04-16-what-is-jwt/001.png)

签名用于验证消息的发送者以及消息是没有经过篡改的。

>
> 参考资料：
>
> [JWT 简介](https://segmentfault.com/a/1190000005047525)
> [手动实现一个 json web token](https://segmentfault.com/a/1190000009030769)
>