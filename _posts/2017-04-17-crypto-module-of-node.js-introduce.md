---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: Node.js crypto 模块简介
type: 【整理】
category: Node.js

tags: crypto

keyword: Node.js crypto 模块简介

author: Aidan
date: 2017-04-17
---

密码技术是互联网应用的一项最基本的技术之一，主要保证了数据的安全。安全定义是多维度的，通过不可逆的hash算法可以保证登陆密码的安全；通过非对称的加密算法，可以保证数据存储的安全性；通过数字签名，可以验证数据在传输过程中是否被篡改。

Node.js的Crypto库就提供各种加密算法，可以非常方便地让我们使用密码技术，解决应用开发中的问题。

* TOC
{:toc}

# 1 Crypto 简介

Crypto　利用　OpenSSL　库来实现它的加密技术，它提供　OpenSSL　中的一系列哈希方法，包括　hmac、cipher、decipher、签名和验证等方法的封装。

Crypto 官方文档： [http://nodejs.org/api/crypto.html](http://nodejs.org/api/crypto.html)

# 2 Hash 算法

## 2.1 简介

哈希算法是指将任意长度的二进制值映射为较短的固定长度的二进制值，这个小的二进制值称为哈希值。哈希值是一段数据唯一且极其紧凑的数值表示形式。如果散列一段明文而且哪怕只更改该段落的一个字母，随后的哈希都将产生不同的值。要找到散列为同一个值的两个不同的输入，在计算上是不可能的，所以数据的哈希值可以检验数据的完整性。一般用于快速查找和加密算法。

通常我们对登陆密码，一般都是使用　Hash　算法进行加密，典型的哈希算法包括 ‘md5′,’sha’,’sha1′,’sha256′,’sha512′,’RSA-SHA’等。

关于 Hash 算法的详细资料可以参考:
- [王家逸：Hash 算法](http://www.cnblogs.com/wangjy/archive/2011/09/08/2171638.html)

由于　md5　已经有了大量的字典库，对于安全级别一般的网站用　sha1　吧；如果安全级别要求很高，CPU　配置也很牛，可以考虑用　sha512。为了更安全的可以加　salt，我会在另一篇博客里面做详细的介绍。

## 2.2 node.js 中的使用

node.js 中的　crypto 中支持多种　Hash 算法，下面是使用　md5 算法的例子：

```javascript
const crypto = require('crypto')

const hash = crypto.createHash('md5')

// 可任意多次调用update()
hash.update('Hello, world!')
hash.update('Hello, nodejs!')

console.log(hash.digest('hex')) // 7e1977739c748beac0c0fd14fd26a544
```

# Hmac 算法

## 2.1 简介

HMAC 是密钥相关的哈希运算消息认证码（Hash-based Message Authentication Code）,HMAC 运算利用哈希算法，以一个密钥和一个消息为输入，生成一个消息摘要作为输出。HMAC可以有效防止一些类似md5的彩虹表等攻击，比如一些常见的密码直接MD5存入数据库的，可能被反向破解。

定义 HMAC 需要一个加密用散列函数（表示为 H，可以是 MD5 或者 SHA-1）和一个密钥K。我们用 B 来表示数据块的字节数。（以上所提到的散列函数的分割数据块字长B=64），用L来表示散列函数的输出数据字节数（ MD5 中 L = 16, SHA-1 中 L = 20）。鉴别密钥的长度可以是小于等于数据块字长的任何正整数值。**应用程序中使用的密钥长度若是比 B 大，则首先用使用散列函数 H 作用于它，然后用 H 输出的 L 长度字符串作为在 HMAC 中实际使用的密钥。一般情况下，推荐的最小密钥 K 长度是 L 个字节**。

关于 Hmac 算法的详细资料可以参考:
- [消息摘要算法-HMAC算法](http://blog.csdn.net/feiyangxiaomi/article/details/34445005)
- [HMAC算法](http://blog.csdn.net/fw0124/article/details/8473858)

## 2.2 node.js 中的使用

同样的　node.js 中的　crypto 中支持多种　Hmac 算法，下面是使用　sha256 算法的例子：

```
const crypto = require('crypto')

const hmac = crypto.createHmac('sha256', 'secret-key')

hmac.update('Hello, world!')
hmac.update('Hello, nodejs!')

console.log(hmac.digest('hex')) // 80f7e22570...
```

只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把 Hmac 理解为用随机数“增强”的哈希算法。

## 3 加密和解密算法

### 3.1 简介

对于登陆密码来说，是不需要考虑解密的，通常都会用不可逆的算法，像　md5,　sha-1　等。但是，对于有安全性要求的数据来说，我们是需要加密存储，然后解密使用的，这时需要用到可逆的加密算法。对于这种基于　Key　算法，可以分为对称加密和不对称加密。

- 对称加密算法：通信一方用　Key　加密明文，另一方收到之后用同样的　Key　来解密就可以得到明文。
- 不对称加密算法：使用两把完全不同但又是完全匹配的一对　Key（公钥和私钥）。在使用不对称加密算法加密文件时，只有使用匹配的一对公钥和私钥，才能完成对明文的加密和解密过程。

### 3.2 node.js 中的使用

同样的　node.js 中的　crypto 中支持多种加密解密算法，下面是使用　aes 算法的例子：


```javascript
const crypto = require('crypto')

function aesEncrypt(data, key) {
  const cipher = crypto.createCipher('aes192', key)
  var crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key)
  var decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

var data = 'Hello, this is a secret message!'
var key = 'Password!'
var encrypted = aesEncrypt(data, key)
var decrypted = aesDecrypt(encrypted, key)

console.log('Plain text: ' + data)
console.log('Encrypted text: ' + encrypted)
console.log('Decrypted text: ' + decrypted)

运行结果如下：

```
Plain text: Hello, this is a secret message!
Encrypted text: 8a944d97bdabc157a5b7a40cb180e7...
Decrypted text: Hello, this is a secret message!
```

可以看出，加密后的字符串通过解密又得到了原始内容。

注意到 aes 有很多不同的算法，如 aes192，aes-128-ecb，aes-256-cbc 等，aes 除了密钥外还可以指定 IV（[Initialization Vector](https://zh.wikipedia.org/wiki/%E5%88%9D%E5%A7%8B%E5%90%91%E9%87%8F)）参见：[crypto.createCipheriv](http://nodejs.cn/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv)，不同的系统只要 IV 不同，用相同的密钥加密相同的数据得到的加密结果也是不同的。加密结果通常有两种表示方法：hex 和 base64，这些功能 Node.js 全部都支持，但是在应用中要注意，如果加解密双方一方用 Node.js，另一方用 Java、PHP 等其它语言，需要仔细测试。如果无法正确解密，要确认双方是否遵循同样的 aes 算法，字符串密钥和 IV 是否相同，加密后的数据是否统一为 hex 或 base64 格式。

## 4 签名和验证算法

### 4.1 简介

我们除了对数据进行加密和解密，还需要判断数据在传输过程中，是否真实际和完整，是否被篡改了。那么就需要用到签名和验证的算法，利用不对称加密算法，通过私钥进行数字签名，公钥验证数据的真实性。

数字签名的制作和验证过程，如下图所示。

![数字签名的制作和验证过程](../asset/image/blog/2017-04-17-crypto-module-of-node.js-introduce/001.png)

### 4.2 node.js 中的使用

同样可以使用多种算法，下面是　HASH256　算发的例子：(签名和验证算法必须使用一对公钥和私钥来签名和验证)

```
const crypto = require('crypto')

function sign (input, algorithm, privateSecret) {
  const signature = crypto.createSign(algorithm).update(input).sign(privateSecret, 'hex')

  return signature
}

function verify (input, algorithm, publicSecret, signture) {
  const passVerify = crypto.createVerify(algorithm).update(input).verify(
    publicSecret,
    signature,
    'hex'
  )

  return passVerify
}

const token = 'I am Aidan'
const publicSecret =  `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD8dB8TsTVR8Dnulb+E7rORNWZS
RmfpVGHwXofKckiI8b2FG/a9hbaf8xsb1oLjW3LUYWK6m4PpoaL7qukd/XFr+dhD
toncv078llzwDjh2TRW8Vf68/vSwoYOXAE0dXDiLLhb7s7kH8z60VW3ooTYTfLyt
e5D3Diixl0GFEFMkAQIDAQAB
-----END PUBLIC KEY-----`
const privateSecret = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQD8dB8TsTVR8Dnulb+E7rORNWZSRmfpVGHwXofKckiI8b2FG/a9
hbaf8xsb1oLjW3LUYWK6m4PpoaL7qukd/XFr+dhDtoncv078llzwDjh2TRW8Vf68
/vSwoYOXAE0dXDiLLhb7s7kH8z60VW3ooTYTfLyte5D3Diixl0GFEFMkAQIDAQAB
AoGBANnEARqnfesUYaSgn/g3P8Y+XekSuofXNjR2FoRXWKJohKbRnGGXehU3S2cT
/wvH0qHI77UwePWLbF/S6gvol3BqGgdN1ieikcH7LyEMtoNv6TX0n7HusfDdQDkh
xQACb/4pN/MhN7HnhJh0EZIepq7/OTocRVusxeEgT83XlqWRAkEA/q/Ew1WirFZj
VavM1WWLpDaGHdMvtR5ganymHos3pdwfIsJyfTzSMqjA1zoozfiB57YSY/6mI8Df
pifbtI1powJBAP3BZ6NsygBz4KcCxlFerkajhNenOGEF76L/YHPsvwGM+2PcL/rS
/xIfPAj6ykaVoTSfwCVSe98dHGEAhzePngsCQQCQgaiR8IfxYr7QAD+joQ8/aFRm
ncoG6SppoTocQH+dkyzzawLM/nKBnfB07iHy5BrJHyyGIhmgVbJQM3NcmZQjAkBu
YZ8Pe9cy8zUZ8R8LbkApAiBbHqZrrgVbxfLS+nzr08PW4IUOepHx9BxNW6p5ocUJ
+yO+GG9B0ovxtiUbiiGZAkA0txGLM3ciSjOkYITCnsjZu3ZklbtilA7VpDwDnzok
C95wpYcaTHMBYX1fOUj+TNROmeS8/CT6TpQtZxJ7v4bc
-----END RSA PRIVATE KEY-----`

// 私钥签名，公钥验证
const signature = sign(token, 'RSA-SHA256', privateSecret)
const passVerify = verify(token, 'RSA-SHA256', publicSecret, signature)

console.log(signature)
console.log(passVerify) // true
```

注：秘钥对的生成

```
openssl genrsa -out rsa_private_key.pem

openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
```

## 5 协商秘钥算法　Diffie-Hellman

### 5.1 DH 密钥交换算法

[参见我的另一篇博客：DH　密钥交换算法](/posts/dh-algorithm.html)

### 5.2 Node.js 中的使用

```javascript
const crypto = require('crypto');

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);
```

>
>参考资料：
>
>[Node.js 加密算法库 Crypto](http://ju.outofmemory.cn/entry/118198)
>[crypto](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501504929883d11d84a1541c6907eefd792c0da51000)
>