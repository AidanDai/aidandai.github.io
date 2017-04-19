---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: DH 密钥交换算法
type: 【转载】
category: 算法

tags: DH

keyword: DH　密钥交换算法

author: Aidan
date: 2017-04-17
---

迪菲－赫尔曼密钥交换（Diffie–Hellman key exchange，简称“D–H”） 是一种安全协议。它可以让双方在完全没有对方任何预先信息的条件下通过不安全信道建立起一个密钥。这个密钥可以在后续的通讯中作为对称密钥来加密通讯内容。

* TOC
{:toc}

## 1 算法描述

离散对数的概念：

原根：如果 a 是素数 p 的一个原根，那么数值：a mod p，a^2 mod p，…，a^(p-1) mod p 是各不相同的整数，且以某种排列方式组成了从 1 到 p-1 的所有整数。
离散对数：如果对于一个整数　b　和素数　p　的一个原根　a，可以找到一个唯一的指数 i，使得：b =（a的i次方） mod　p；其中　0　≦　i ≦　p-1，那么指数　i　称为　b　的以　a　为基数的模　p　的离散对数。

Diffie-Hellman 算法的有效性依赖于计算离散对数的难度，其含义是：当已知大素数　p　和它的一个原根　a　后，对给定的 b，要计算 i ，被认为是很困难的，而给定 i 计算　b 却相对容易。

Diffie-Hellman算法：

假如用户 A 和用户 B 希望交换一个密钥。
取素数 p 和整数 a，a 是 p 的一个原根，公开 a 和 p。
用户 A 选择随机数 XA < p，并计算　YA = a^XA mod p。
用户 B　选择随机数 XB < p，并计算 YB　= a^XB mod p。
每一方都将 X 保密而将 Y 公开让另一方得到。
用户 A 计算密钥的方式是：K = (YB)^XA mod p
用户 B 计算密钥的方式是：K = (YA)^XB mod p

证明：

```
	(YB)^XA mod p = (a^XB mod　p)^XA mod p
= (a^XB)^XA mod p = (a^XA)^XB mod p    (密钥即为 a^(XA*XB) mod p)
=　(a^XA mod　p)^XB mod p　= (YA)^XB mod p
```

由于 XA 和 XB 是保密的，而第三方只有 p、a、YB、YA 可以利用，只有通过取离散对数来确定密钥，但对于大的素数 p，计算离散对数是十分困难的。

例子：

假如用户　Alice　和用户　Bob　希望交换一个密钥。
取一个素数　p =　97　和　97　的一个原根　a　=　5。
Alice　和　Bob　分别选择秘密密钥　XA　=　36　和　XB　=　58，并计算各自的公开密钥：
YA　=　a^XA mod p　=　5^36 mod 97　=　50
YB　=　a^XB mod p　=　5^58 mod 97　=　44
Alice　和　Bob　交换了公开密钥之后，计算共享密钥如下：
Alice：K　=　(YB)^XA mod p　=　44^36 mod 97　=　75
Bob：K　=　(YA)^XB mod p　=　50^58 mod 97　=　75 

## 2 安全性

当然，为了使这个例子变得安全，必须使用非常大的 XA, XB 以及 p， 否则可以实验所有的可能取值。(总共有最多 97 个这样的值, 就算 XA 和 XB 很大也无济于事)。如果 p 是一个至少 300 位的质数，并且 XA 和 XB 至少有 100 位长， 那么即使使用全人类所有的计算资源和当今最好的算法也不可能从a, p和a^(XA*XB) mod p 中计算出 XA*XB。这个问题就是著名的离散对数问题。注意 g 则不需要很大, 并且在一般的实践中通常是 2 或者 5。

在最初的描述中，迪菲－赫尔曼密钥交换本身并没有提供通讯双方的身份验证服务，因此它很容易受到中间人攻击。 一个中间人在信道的中央进行两次迪菲－赫尔曼密钥交换，一次和 Alice 另一次和 Bob，就能够成功的向 Alice 假装自己是 Bob ，反之亦然。而攻击者可以解密（读取和存储）任何一个人的信息并重新加密信息，然后传递给另一个人。因此通常都需要一个能够验证通讯双方身份的机制来防止这类攻击。有很多种安全身份验证解决方案使用到了迪菲－赫尔曼密钥交换。例如当 Alice 和 Bob 共有一个公钥基础设施时，他们可以将他们的返回密钥进行签名。

>
>原文：
>
>[DH 密钥交换算法](http://blog.csdn.net/fw0124/article/details/8462373)
>