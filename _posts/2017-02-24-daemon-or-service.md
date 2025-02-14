---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: Linux守护进程(init.d和xinetd)
type: 【转载】
category: linux

tags: 守护进程

keyword: linux守护进程 daemon service 

author: Aidan
date: 2017-02-24
---

在了解 Linux 守护进程的过程中发现一篇好文，在此转载下希望更多的人能看到。

* TOC
{:toc}

# 1 Linux守护进程

Linux 服务器在启动时需要启动很多系统服务，它们**向本地和网络用户提供了Linux的系统功能接口，直接面向应用程序和用户**。提供这些服务的程序是由运行在后台的守护进程来执行的。守护进程是生存期长的一种进程(与操作系统同生共死)。它们独立于控制终端并且周期性的执行某种任务或等待处理某些发生的事件。他们常常在系统引导装入时启动，在系统关闭时终止。linux系统有很多守护进程，大多数服务器都是用守护进程实现的。同时，守护进程完成许多系统任务，比如，作业规划进程crond、打印进程lqd等。有些书籍和资料也把守护进程称作：“服务”。

守护进程，也就是指daemon和service。 

# 2 Linux守护进程的分类

根据守护进程的启动和管理方式，可以分为`独立启动守护进程`和`超级守护进程`两类

- 独立启动（stand_alone):该类进程启动后就常驻内存，所以会一直占用系统资源。其最大的优点就是它会一直启动，当外界有要求时相应速度较快，像httpd等进程；

- 超级守护进程：系统启动时由一个统一的守护进程xinet来负责管理一些进程，当相应请求到来时需要通过xinet的转接才可以唤醒被xinet管理的进程。这种进程的优点时最初只有xinet这一守护进程占有系统资源，其他的内部服务并不一直占有系统资源，只有数据包到来时才会被xinet管理员来唤醒。并且我们还可以通过xinet来对它所管理的进程设置一些访问权限，相当于多了一层管理机制。

如果用两个比喻来形容两类守护进程的话一般会用银行的业务处理窗口来类比：
   
- 独立启动：银行里有一种单服务的窗口，像取钱，存钱等窗口，这些窗口边上始终会坐着一个人，如果有人来取钱或存钱，可以直接到相应的窗口去办理，这个处理单一服务的始终存在的人就是独立启动的守护进程；

- 超级守护进程：银行里还有一种窗口，提供综合服务，像汇款，转账，提款等业务；这种窗口附近也始终坐着一个人（xinet），她可能不提供具体的服务，提供具体服务的人在里面闲着聊天啊，喝茶啊，但是当有人来汇款时他会大声喊一句，小王，有人汇款啦，然后里面管汇款的小王会立马跑过来帮忙办完汇款业务。其他的人继续聊天，喝茶。这些负责具体业务的人我们就称之为超级守护进程。当然可能汇款人会有一些规则，可能不能往北京汇款，他就会提早告诉xinet，所以如果有人来汇款想汇往北京的话，管理员就直接告诉他这个我们这里办不到的，于是就根本不会去喊汇款员了，相当于提供了一层管理机制。针对这种窗口还存在多线程和单线程的区别：多线程：将所有用户的要求都提上来，里面的人都别闲着了，都一起干活吧；单线程：大家都排好队了，一个一个来，里面的人同一时间只有一个人在工作。

这里需要注意的是超级守护进程的管理员xinet也是一个守护进程，只不过它的任务就是传话，其实这也是一个很具体很艰巨的任务哦。

当然每个守护进程都会监听一个端口（银行窗口），一些常用守护进程的监听端口是固定的，像httpd监听80端口，sshd监听22端口等；我们可以将其理解为责任制，时候等待，有求必应。具体的端口信息可以通过cat /etc/services来查看。

# 3 Linux守护进程管理工具

Linux提供了三种不同的守护进程管理工具：redhat-config-services、ntsysv、chkconfig，可以根据具体需要灵活运用。

```bash
# service iptables status    
# 查看相应服务的状态，用service需要服务在/etc/init.d/目录中存在

# netstat -tulp    
# 会列出相应的服务及其监听的端口号等，若加n参数会列出端口号

# chkconfig --list | grep 服务名 
# 会列出现在当前服务的各种状态，包括在不同运行级别下的启情况，分为上线两部分，上部分是独立启动的服务，你会看到xinetd也在，下面部分是有inet管理的超级守护进程，没有运行级别可分的。
```

# 4 Linux守护进程的运行方式

## 4.1 独立运行（stand-alone）的守护进程

独立运行的守护进程由init脚本负责管理，所有独立运行的守护进程的脚本在/etc/rc.d/init.d/目录下。系统服务都是独立运行的守护进程，包括syslogd和cron等。独立运行的守护进程的工作方式称做stand-alone，它是UNIX传统的C/S模式的访问模式。stand-alone模式的工作原理如下图所示。

工作在stand-alone模式下的网络服务有xinetd、route、gated，另外还有Web服务器Apache和邮件服务器Sendmail、域名服务器Bind。在Linux系统中通过stand-alone模式启动的服务由/etc/rc.d/下面对应的运行级别当中的符号链接启动。

![stand-alone模式](../asset/image/blog/2017-02-24-daemon-or-service/001.jpg) 

## 4.2 xinetd模式运行独立的守护进程

从守护进程的概念可以看出，对于系统所要通过的每一种服务，都必须运行一个监听某个端口连接所发生的守护进程，这通常意味着资源浪费。为了解决这个问题，Linux引进了"网络守护进程服务程序"的概念。Red Hat Linux 9.0使用的网络守护进程是xinted（eXtended InterNET daemon）。xinetd能够同时监听多个指定的端口，在接受用户请求时，它能够根据用户请求的端口的不同，启动不同的网络服务进程来处理这些用户请求。可以把xinetd看做一个管理启动服务的管理服务器，它决定把一个客户请求交给哪个程序处理，然后启动相应的守护进程。xinetd无时不在运行并监听它所管理的所有端口上的服务。当某个要连接它管理的某项服务的请求到达时，xinetd就会为该服务启动合适的服务器。xinetd模式的工作原理如下图所示。

![xinetd模式](../asset/image/blog/2017-02-24-daemon-or-service/002.jpg) 

## 4.3 xinetd和stand-alone工作模式的比较

xinetd和stand-alone工作模式相比，系统不想要每一个网络服务进程都监听其服务端口，运行单个xinetd就可以同时监听所有服务端口，这样就降低了系统开销，保护系统资源。但是对于访问量大、经常出现并发访问的情况，xinetd则要频繁启动相应的网络服务进程，反而会导致系统性能下降。查看系统为Linux服务提供哪种工作模式，可以在Linux命令行中使用pstree命令，就能看到两种不同模式启动的网络服务。一般来说系统中一些负载高的服务，Sendmail、Apache服务是单独启动的；而其他服务类型都可以使用xinetd超级服务器管理。

# 5 Xinetd

## 5.1 什么是xinetd

xinetd即extended internet daemon，xinetd是新一代的网络守护进程服务程序，又叫超级Internet服务器。经常用来管理多种轻量级Internet服务。xinetd提供类似于inetd+tcp_wrapper的功能，但是更加强大和安全。

xinetd本身也是一个独立的守护进程，在/etc/init.d/xinetd。 

## 5.2 xinetd的特色

### 5.2.1 强大的存取控制功能

- 内置对恶意用户和善意用户的差别待遇设定。
- 使用libwrap支持，其效能更甚于tcpd。
- 可以限制连接的等级，基于主机的连接数和基于服务的连接数。
- 设置特定的连接时间。
- 将某个服务设置到特定的主机以提供服务。

### 5.2.2 有效防止DoS攻击

- 可以限制连接的等级。
- 可以限制一个主机的最大连接数，从而防止某个主机独占某个服务。
- 可以限制日志文件的大小，防止磁盘空间被填满。

### 5.2.3 强大的日志功能

- 可以为每一个服务就syslog设定日志等级。
- 如果不使用syslog，也可以为每个服务建立日志文件。
- 可以记录请求的起止时间以决定对方的访问时间。
- 可以记录试图非法访问的请求。

### 5.2.4 转向功能

可以将客户端的请求转发到另一台主机去处理。

### 5.2.5 支持IPv6

xinetd自xinetd 2.1.8.8pre*起的版本就支持IPv6，可以通过在./configure脚本中使用with-inet6 capability选项来完成。注意，要使这个生效，核心和网络必须支持IPv6。当然IPv4仍然被支持。

### 5.2.6 与客户端的交互功能

无论客户端请求是否成功，xinetd都会有提示告知连接状态。

## 5.3 Xinetd的缺点

当前，它最大的缺点是对RPC支持的不稳定性，但是可以启动protmap，使它与xinetd共存来解决这个问题。

## 5.4 使用xinetd启动守护进程

原则上任何系统服务都可以使用xinetd，然而最适合的应该是那些常用的网络服务，同时，这个服务的请求数目和频繁程度不会太高。像DNS和Apache就不适合采用这种方式，而像FTP、Telnet、SSH等就适合使用xinetd模式，系统默认使用xinetd的服务可以分为如下几类。

① 标准Internet服务：telnet、ftp。

② 信息服务：finger、netstat、systat。

③ 邮件服务：imap、imaps、pop2、pop3、pops。

④ RPC服务：rquotad、rstatd、rusersd、sprayd、walld。

⑤ BSD服务：comsat、exec、login、ntalk、shell、talk。

⑥ 内部服务：chargen、daytime、echo、servers、services、time。

⑦ 安全服务：irc。

⑧ 其他服务：name、tftp、uucp。

## 5.5 解读xinet的配置文件

xinet的配置文件的配置文件主要有/etc/services, /etc/xinetd.conf和/etc/xinetd.d/*

### 5.5.1 /etc/services

在/etc/services 中设置了xinetd下的service对应的端口，例如：

```bash
$ cat /etc/services | grep rsync
rsync           873/tcp                         # rsync
rsync           873/udp                         # rsync
```

### 5.5.2 /etc/xinetd.conf

xinetd的配置文件是/etc/xinetd.conf，但是它只包括几个默认值及/etc/xinetd.d目录中的配置文件。如果要启用或禁用某项xinetd服务，编辑位于/etc/xinetd.d目录中的配置文件。例如，disable属性被设为yes，表示该项服务已禁用；disable属性被设为no，表示该项服务已启用。/etc/xinetd.conf有许多选项，下面是RHEL 4.0的/etc/xinetd.conf。

```bash
# Simple configuration file for xinetd
# Some defaults, and include /etc/xinetd.d/
defaults
{
    instances               = 60
    log_type                = SYSLOG authpriv
    log_on_success          = HOST PID
    log_on_failure          = HOST
    cps                     = 25 30
}
includedir /etc/xinetd.d

# instances = 60：表示最大连接进程数为60个。
# log_type = SYSLOG authpriv：表示使用syslog进行服务登记。
# log_on_success= HOST PID：表示设置成功后记录客户机的IP地址的进程ID。
# log_on_failure = HOST：表示设置失败后记录客户机的IP地址。
# cps = 25 30：表示每秒25个入站连接，如果超过限制，则等待30秒。主要用于对付拒绝服务攻击。
# includedir /etc/xinetd.d：表示告诉xinetd要包含的文件或目录是/etc/xinetd.d。
```

### 5.5.3 /etc/xinetd.d/*

下面以/etc/xinetd.d/中的一个文件（rsync）为例。

```bash
service rsync
{
    disable = yes
    socket_type       =   stream
    wait              =   no
    user              =   root
    server            =   /usr/bin/rsync
    log_on_failure    +=  USERID
}

# 下面说明每一行选项的含义。
# disable = yes：表示禁用这个服务。
# socket_type = stream：表示服务的数据包类型为stream。
# wait = no：表示不需等待，即服务将以多线程的方式运行。
# user = root：表示执行此服务进程的用户是root。
# server = /usr/bin/rsync：启动脚本的位置。
# log_on_failure += USERID：表示设置失败时，UID添加到系统登记表。
```

# 6 配置xinetd

## 6.1 格式

/etc/xinetd.conf中的每一项具有下列形式：

```bash
service service-name
{
  # ……
}
```

其中service是必需的关键字，且属性表必须用大括号括起来。每一项都定义了由service-name定义的服务。

service-name是任意的，但通常是标准网络服务名，也可增加其他非标准的服务，只要它们能通过网络请求激活，包括localhost自身发出的网络请求。有很多可以使用的属性，稍后将描述必需的属性和属性的使用规则。

操作符可以是=、+=或-=。所有属性可以使用=，其作用是分配一个或多个值，某些属性可以使用+=或-=，其作用分别是将其值增加到某个现存的值表中，或将其值从现存值表中删除。

## 6.2 配置文件

相关的配置文件如下：

```
/etc/xinetd.conf
/etc/xinetd.d/*     // 该目录下的所有文件
/etc/hosts.allow
/etc/hosts.deny
```

## 6.3 /etc/xinetd.conf中的disabled与enabled

前者的参数是禁用的服务列表，后者的参数是启用的服务列表。他们的共同点是格式相同（属性名、服务名列表与服务中间用空格分开，例如disabled = in.tftpd in.rexecd），此外，它们都是作用于全局的。如果在disabled列表中被指定，那么无论包含在列表中的服务是否有配置文件和如何设置，都将被禁用；如果enabled列表被指定，那么只有列表中的服务才可启动，如果enabled没有被指定，那么disabled指定的服务之外的所有服务都可以启动。

## 6.4 注意问题

① 在重新配置的时候，下列的属性不能被改变：socket_type、wait、protocol、type；

② 如果only_from和no_access属性没有被指定（无论在服务项中直接指定还是通过默认项指定），那么对该服务的访问IP将没有限制；

③ 地址校验是针对IP地址而不是针对域名地址。

# 7 xinetd防止拒绝服务攻击（Denial of Services）的原因

xinetd能有效地防止拒绝服务攻击（Denial of Services）的原因如下。

## 7.1 限制同时运行的进程数

通过设置instances选项设定同时运行的并发进程数：`instances＝20`；当服务器被请求连接的进程数达到20个时，xinetd将停止接受多出部分的连接请求。直到请求连接数低于设定值为止。

## 7.2 限制一个IP地址的最大连接数

通过限制一个主机的最大连接数，从而防止某个主机独占某个服务。`per_source＝5`这里每个IP地址的连接数是5个。

## 7.3 限制日志文件大小，防止磁盘空间被填满

许多攻击者知道大多数服务需要写入日志。入侵者可以构造大量的错误信息并发送出来，服务器记录这些错误，可能就造成日志文件非常庞大，甚至会塞满硬盘。同时会让管理员面对大量的日志，而不能发现入侵者真正的入侵途径。因此，限制日志文件大小是防范拒绝服务攻击的一个方法。

```
log_type FILE.1 /var/log/myservice.log 8388608 15728640
```

这里设置的日志文件FILE.1临界值为8MB，到达此值时，syslog文件会出现告警，到达15MB，系统会停止所有使用这个日志系统的服务。

## 7.4 限制负载

xinetd还可以使用限制负载的方法防范拒绝服务攻击。用一个浮点数作为负载系数，当负载达到这个数目的时候，该服务将暂停处理后续的连接。

```
max_load = 2.8
```

上面的设定表示当一项系统负载达到2.8时，所有服务将暂时中止，直到系统负载下降到设定值以下。
说明  要使用这个选项，编译时应加入“--with-loadavg”，xinetd将处理max-load配置选项，从而在系统负载过重时关闭某些服务进程，来实现防范某些拒绝服务攻击。

## 7.5 限制所有服务器数目（连接速率）

xinetd可以使用cps选项设定连接速率，下面的例子：

```
cps = 25 60
```

上面的设定表示服务器最多启动25个连接，如果达到这个数目将停止启动新服务60秒。在此期间不接受任何请求。

## 7.6 限制对硬件资源的利用

通过rlimit_as和rlimit_cpu两个选项可以有效地限制一种服务对内存、中央处理器的资源占用：

```
rlimit_as = 8M
rlimit_cpu=20
```

上面的设定表示对服务器硬件资源占用的限制，最多可用内存为8MB，CPU每秒处理20个进程。

xinetd的一个重要功能是它能够控制从属服务可以利用的资源量，通过它的以上设置可以达到这个目的，有助于防止某个xinetd服务占用大量资源，从而导致“拒绝服务”情况的出现。 

 

# 8 Service命令

Linux的service命令就是查看和控制所有的独立启动的守护进程。 这个命令不是在所有的linux发行版本中都有。主要是在redhat系linux中。service此命令位于/sbin/service，用file命令查看此命令会发现它是一个脚本命令。分析脚本可知此命令的作用是去/etc/init.d目录下寻找相应的服务，进行开启和关闭等操作。例如service mysqld stop等价于/etc/init.d/mysqld stop。

>
>原文：
>
>[iTech：Linux守护进程(init.d和xinetd)](http://www.cnblogs.com/itech/archive/2010/12/27/1914846.html)
>
