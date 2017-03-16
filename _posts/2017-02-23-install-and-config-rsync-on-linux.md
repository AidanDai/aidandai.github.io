---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: linux 上安装并配置 rsync 
type: 【整理】
category: web

tags: rsync

keyword: rsync install 

author: Aidan
date: 2017-02-23
---

本文主要介绍一下 rsync 的安装及配置，当然还有在这中间踩的坑

* TOC
{:toc}

# 1 什么是rsync

rsync（remote synchronize）是一个远程数据同步工具，可通过LAN/WAN快速同步多台主机间的文件。rsync使用所谓的“rsync算法”来使本地和远 程两个主机之间的文件达到同步，这个算法只传送两个文件的不同部分，而不是每次都整份传送，因此速度相当快。


rsync本来是用于替代rcp的一个工具，目前由rsync.samba.org维护，所以rsync.conf文件的格式类似于samba的主配置文件。rsync可以通过rsh或ssh使用，也能以daemon模式去运行，在以daemon方式运行时rsync server会打开一个873端口，等待客户端去连接。连接时，rsync server会检查口令是否相符，若通过口令查核，则可以开始进行文件传输。第一次连通完成时，会把整份文件传输一次，以后则就只需进行增量备份。

rsync支持大多数的类Unix系统，无论是Linux、Solaris还是BSD上都经过了良好的测试。此外，它在windows平台下也有相应的版本，如cwrsync和Sync2NAS等工具。

# 2 rsync的基本特点

1.可以镜像保存整个目录树和文件系统；

2.可以很容易做到保持原来文件的权限、时间、软硬链接等；

3.无须特殊权限即可安装；

4.优化的流程，文件传输效率高；

5.可以使用rsh、ssh等方式来传输文件，当然也可以通过直接的socket连接；

6.支持匿名传输

# 3 rsync安装

```bash
sudo apt-get install rsync  # ubuntu
sudo yum install rsync      # centos
```

# 4 服务器端配置

## 4.1 基本配置文件


默认配置文件位置：

```bash
/etc/rsyncd.conf  # 配置文件
/etc/rsync.pwd    # 授权用户信息
```

```bash
# 全局参数

# 运行rsync守护进程的用户
uid = root

# 运行rsync守护进程的组
gid = root

# 不使用chroot
use chroot = no

# 最大连接数为4
max connections = 4

# 是否检查口令文件的权限
strict modes = yes

# 默认端口873
port = 873

# 下面这些绿色文件是安装完rsync服务后自动生成的文件

# pid文件的存放位置
pid file = /var/run/rsyncd.pid

 # 锁文件的存放位置
lock file = /var/run/rsync.lock

# 日志记录文件的存放位置
log file = /var/log/rsyncd.log

# 模块参数

# 这里是认证的模块名，在client端需要指定
[app]
		path = app_path
		# 这个模块的注释信息
		comment = deploy

		# 只读
		read only = yes

		# 是否允许列文件
		list = yes

		# 密码和用户名对比表，密码文件自己生成
		secrets file = /etc/rsync.pas

		# 认证的用户名，如果没有这行则表明是匿名，此用户与系统无关
		auth users = qiaowen

		# 可以忽略一些无关的IO错误
		ignore errors

		# 允许主机
		# hosts allow = 192.168.1.1,10.10.10.10

		# 禁止主机
		# hosts deny = 0.0.0.0/0
		# transfer logging = yes
```

## 4.2 配置rsync密码

在上边的配置文件中已经写好路径(/etc/rsync.pas; 名字随便写，只要和上边配置文件里的一致即可），格式(一行一个用户)

```
账号:密码
```

```bash
echo username:password > /etc/rsync.pas

# /etc/rsync.pas 的权限一定要是 600
chown 600 /etc/rsync.pas
```

## 4.3 配置欢迎信息(可有可无)

```bash
echo Welcome to use the rsync services! > /etc/rsyncd.motd

# /etc/rsyncd.motd 的权限一定要是 600
chown 600 /etc/rsyncd.motd
```

## 4.4 rsync服务相关配置

服务端由于 rsync 默认是由超级守护进程([关于超级守护进程请参考我的另一篇博客]()) xinetd 管理的，所以我们必须先安装 xinetd  

安装并启动 xinetd

```bash
yum install xinetd
service xinetd start
```

修改 xinetd 管理 rsync 的配置文件 

```bash
vim /etc/xinetd.d/rsync
```

把原来的 disable = yes 改成 disable = no ，修改后文件如下


```
service rsync
{
    disable         = no
    socket_type     = stream
    wait            = no
    user            = root
    server          = /usr/bin/rsync
    server_args     = --daemon
    log_on_failure  += USERID
}
```

## 4.5 让配置生效

```bash
service xinetd restart
```

# 5 启动 rsync

rsync服务端启动的两种方法

1、直接启动rsync服务端

``bash
rsync --daemon
```

2、使用xinetd超级进程启动rsync服务端

```bash
/etc/rc.d/init.d/xinetd reload
```

# 6 配置 rsync 为自启动服务 

加入 rc.local

在各种操作系统中，rc文件存放位置不尽相同，可以修改使系统启动时把rsync --daemon加载进去。

```bash
vim /etc/rc.local
```

加入一行

```bash
rsync --daemon
```

或者设置随系统启动rsync（可以不设置随系统启动）

```bash
chkconfig rsync on
```

# 7 检查rsync

```bash
netstat -a | grep rsync
tcp   0   0 0.0.0.0:873     0.0.0.0:*       LISTEN
```

# 8 配置rsync client 

## 8.1 设置密码

```bash
echo 123456 > /etc/rsync.pas 

# /etc/rsync.pas 文件的权限必须为 600
chmod 600 /etc/rsync.pas
```

## 8.2 client 连接 rsync server

从rsync server端取文件（会先删除 /home/app 下的文件）

```bash
rsync -vzrtopg --progress --delete username@host::app /home/app --password-file=/etc/rsync.pas
```

- 向rsync server端上传文件

```bash
rsync -vzrtopg --progress --password-file=/etc/rsync.pas  /home/app username@host::app
```

这个命令将把本地机器 /home/app 目录下的所有文件（含子目录）全部备份到 rsync server 的 app 模块的设定的备份目录下。

**请注意如果路径结束后面带有"/",表示备份该目录下的东东，但不会创建该目录，如不带"/"则创建该目录。**

>
>参考资料：
>
>[rsync 安装使用详解](http:#sookk8.blog.51cto.com/455855/328076/)
>
>[rsync 安装、部署详解](http:#blog.csdn.net/zhao_s/article/details/42424839)
>
