---
layout: post
title: "【转载】HTTP 分块传输编码"
date: 2016-07-20 10:40
tags: http
category: http
author: Aidan
---

分块传输编码（Chunked transfer encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许 HTTP 由应用服务器发送给客户端应用（ 通常是网页浏览器）的数据可以分成多个部分。分块传输编码只在 HTTP/1.1 中提供。

通常，HTTP 应答消息中发送的数据是整个发送的，Content-Length 消息头字段表示数据的长度。数据的长度很重要，因为客户端需要知道哪里是应答消息的结束，以及后续应答消息的开始。然而，使用分块传输编码，数据分解成一系列数据块，并以一个或多个块发送，这样服务器可以发送数据而不需要预先知道发送内容的总大小。通常数据块的大小是一致的，但也不总是这种情况。

 
HTTP/1.1 引入分块传输编码提供了以下几点好处：

- `HTTP 分块传输编码允许服务器为动态生成的内容维持 HTTP 持久连接。通常，持久链接需要服务器在开始发送消息体前发送 Content-Length 消息头字段，但是对于动态生成的内容来说，在内容创建完之前是不可知的`。[动态内容，content-length 无法预知]

- 分块传输编码允许服务器在最后发送消息头字段。对于那些头字段值在内容被生成之前无法知道的情形非常重要，例如消息的内容要使用散列进行签名，散列的结果通过 HTTP 消息头字段进行传输。没有分块传输编码时，服务器必须缓冲内容直到完成后计算头字段的值并在发送内容前发送这些头字段的值。[散列签名，需缓冲完成才能计算]

- HTTP 服务器有时使用压缩 （gzip或deflate）以缩短传输花费的时间。分块传输编码可以用来分隔压缩对象的多个部分。在这种情况下，块不是分别压缩的，而是整个负载进行压缩，压缩的输出使用本文描述的方案进行分块传输。在压缩的情形中，分块编码有利于一边进行压缩一边发送数据，而不是先完成压缩过程以得知压缩后数据的大小。[gzip压缩，压缩与传输同时进行]

一般情况 HTTP 的 Header 包含 Content-Length 域来指明报文体的长度。有时候服务生成 HTTP 回应是无法确定消息大小的，比如大文件的下载，或者后台需要复杂的逻辑才能全部处理页面的请求，这时用需要实时生成消息长度，服务器一般使用 chunked 编码。

在进行 Chunked 编码传输时，在回复消息的 Headers 有 transfer-coding 域值为 chunked ，表示将用 chunked 编码传输内容。使用chunked编码的Headers如下（可以利用FireFox的FireBug插件或HttpWatch查看Headers信息）：

采用以下方式编码：

```   
　　Chunked-Body=*chunk   
　　　　　　　　　"0"CRLF   
　　　　　　　　　footer   
　　　　　　　　　CRLF   
　　chunk=chunk-size[chunk-ext]CRLF   
　　　　　　chunk-dataCRLF   

　　hex-no-zero=<HEXexcluding"0">   

　　chunk-size=hex-no-zero*HEX   
　　chunk-ext=*(";"chunk-ext-name["="chunk-ext-value])   
　　chunk-ext-name=token   
　　chunk-ext-val=token|quoted-string   
　　chunk-data=chunk-size(OCTET)   

　　footer=*entity-header 
```

编码使用若干个Chunk组成，由一个标明长度为0的 chunk 结束，每个 Chunk 有两部分组成，第一部分是该 Chunk 的长度和长度单位（一般不 写），第二部分就是指定长度的内容，每个部分用 CRLF 隔开。在最后一个长度为0的 Chunk 中的内容是称为 footer 的内容，是一些没有写的头部内容。   
  　　
下面给出一个Chunked的解码过程（RFC文档中有） 

```  
　　length:=0   
　　readchunk-size,chunk-ext(ifany)andCRLF   
　　while(chunk-size>0){   
	　　readchunk-dataandCRLF   
	　　appendchunk-datatoentity-body   
	　　length:=length+chunk-size   
	　　readchunk-sizeandCRLF   
　　}   
　　readentity-header   
　　while(entity-headernotempty){   
	　　appendentity-headertoexistingheaderfields   
	　　readentity-header   
　　}   
　　Content-Length:=length   
　　Remove"chunked"fromTransfer-Encodin
```

>原文：
>
>[HTTP协议之chunk编码(分块传输编码)](http://blog.csdn.net/xifeijian/article/details/42921827)