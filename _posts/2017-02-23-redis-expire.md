---
layout: post
h1: "Note"
description: "The worst pen is better than the best memory!"
header-img: "../asset/image/blog/blog-bg-001.jpg"

title: 深入理解Redis主键失效原理及实现机制
type: 【转载】
category: web

tags: Redis

keyword: Redis 主键失效原理及实现机制

author: Aidan
date: 2017-02-23
---

作为一种定期清理无效数据的重要机制，主键失效存在于大多数缓存系统中，Redis 也不例外。在 Redis 提供的诸多命令中，EXPIRE、EXPIREAT、PEXPIRE、PEXPIREAT 以及 SETEX 和 PSETEX 均可以用来设置一条 Key-Value 对的失效时间，而一条 Key-Value 对一旦被关联了失效时间就会在到期后自动删除（或者说变得无法访问更为准确）。可以说，主键失效这个概念还是比较容易理解的，但是在具体实现到 Redis 中又是如何呢？最近本博主就对 Redis 中的主键失效机制产生了几个疑问，并根据这些疑问对其进行了仔细的探究，现总结所得如下，以飨各位看客。

* TOC
{:toc}

# 1 失效时间的控制

除了调用PERSIST命令外，还有没有其他情况会撤销一个主键的失效时间？答案是肯定的。首先，在通过 DEL 命令删除一个主键时，失效时间自然会被撤销（这不是废话么，哈哈）。其次，在一个设置了失效时间的主键被更新覆盖时，该主键的失效时间也会被撤销（这貌似也是废话，哈哈）。但需要注意的是，这里所说的是主键被更新覆盖，而不是主键对应的 Value 被更新覆盖，因此 SET、MSET 或者是 GETSET 可能会导致主键被更新覆盖，而像 INCR、DECR、LPUSH、HSET 等都是更新主键对应的值，这类操作是不会触碰主键的失效时间的。此外，还有一个特殊的命令就是 RENAME，当我们使用 RENAME 对一个主键进行重命名后，之前关联的失效时间会自动传递给新的主键，但是如果一个主键是被RENAME所覆盖的话（如主键 hello 可能会被命令 RENAME world hello 所覆盖），这时被覆盖主键的失效时间会被自动撤销，而新的主键则继续保持原来主键的特性。

# 2 失效的内部实现

Redis 中的主键失效是如何实现的，即失效的主键是如何删除的？实际上，Redis 删除失效主键的方法主要有两种：

- 消极方法（passive way），在主键被访问时如果发现它已经失效，那么就删除它

- 积极方法（active way），周期性地从设置了失效时间的主键中选择一部分失效的主键删除

## 2.1 失效的内部表示

接下来我们就通过代码来探究一下这两种方法的具体实现，但在此之前，我们先看一看Redis是如何管理和维护主键的吧（注：本博文中的源码全部来自 Redis-2.6.12）。

【代码段一】给出了 Redis 中关于数据库的结构体定义，这个结构体定义中除了 id 以外都是指向字典的指针，其中我们只看 dict 和 expries，前者用来维护一个 Redis 数据库中包含的所有 Key-Value 对（其结构可以理解为 dict[key]:value，即主键与值之间的映射），后者则用于维护一个 Redis 数据库中设置了失效时间的主键（其结构可以理解为 expires[key]:timeout，即主键与失效时间的映射）。当我们使用 SETEX 和 PSETEX 命令向系统插入数据时，Redis 首先将 Key 和 Value 添加到 dict 这个字典表中，然后将 Key 和失效时间添加到 expires 这个字典表中。当我们使用 EXPIRE、EXPIREAT、PEXPIRE 和 PEXPIREAT 命令设置一个主键的失效时间时，Redis 首先到 dict 这个字典表中查找要设置的主键是否存在，如果存在就将这个主键和失效时间添加到 expires 这个字典表。简单地总结来说就是，设置了失效时间的主键和具体的失效时间全部都维护在 expires 这个字典表中。

【代码段一】

```c
typedef struct redisDb {
    dict *dict;
    dict *expires;
    dict *blocking_keys;
    dict *ready_keys;
    dict *watched_keys;
    int id;
} redisDb;
```

## 2.2 消极方法

在大致了解了 Redis 是如何维护设置了失效时间的主键之后，我们就先来看一看 Redis 是如何实现消极地删除失效主键的。【代码段二】给出了一个名为 expireIfNeeded 的函数，这个函数在任何访问数据的函数中都会被调用，也就是说 Redis 在实现 GET、MGET、HGET、LRANGE 等所有涉及到读取数据的命令时都会调用它，它存在的意义就是在读取数据之前先检查一下它有没有失效，如果失效了就删除它。【代码段二】中给出了 expireIfNeeded 函数的所有相关描述，这里就不再重复它的实现方法了。这里需要说明的是在 expireIfNeeded 函数中调用的另外一个函数 propagateExpire，这个函数用来在正式删除失效主键之前广播这个主键已经失效的信息，这个信息会传播到两个目的地：一个是发送到 AOF文件，将删除失效主键的这一操作以 DEL Key 的标准命令格式记录下来；另一个就是发送到当前 Redis 服务器的所有 Slave，同样将删除失效主键的这一操作以 DEL Key 的标准命令格式告知这些 Slave 删除各自的失效主键。从中我们可以知道，所有作为 Slave 来运行的 Redis 服务器并不需要通过消极方法来删除失效主键，它们只需要对 Master 唯命是从就 OK 了！

【代码段二】

```c 
int expireIfNeeded(redisDb *db, robj *key) {
    //获取主键的失效时间
    long long when = getExpire(db,key);
    //假如失效时间为负数，说明该主键未设置失效时间（失效时间默认为-1），直接返回0
    if (when < 0) return 0;
    //假如Redis服务器正在从RDB文件中加载数据，暂时不进行失效主键的删除，直接返回0
    if (server.loading) return 0;
    //假如当前的Redis服务器是作为Slave运行的，那么不进行失效主键的删除，因为Slave
    //上失效主键的删除是由Master来控制的，但是这里会将主键的失效时间与当前时间进行
    //一下对比，以告知调用者指定的主键是否已经失效了
    if (server.masterhost != NULL) {
        return mstime() > when;
    }
    //如果以上条件都不满足，就将主键的失效时间与当前时间进行对比，如果发现指定的主键
    //还未失效就直接返回0
    if (mstime() <= when) return 0;
    //如果发现主键确实已经失效了，那么首先更新关于失效主键的统计个数，然后将该主键失
    //效的信息进行广播，最后将该主键从数据库中删除
    server.stat_expiredkeys++;
    propagateExpire(db,key);
    return dbDelete(db,key);
}
```

【代码段三】

```c 
void propagateExpire(redisDb *db, robj *key) {
    robj *argv[2];
    //shared.del是在Redis服务器启动之初就已经初始化好的一个常用Redis对象，即DEL命令
    argv[0] = shared.del;
    argv[1] = key;
    incrRefCount(argv[0]);
    incrRefCount(argv[1]);
    //检查Redis服务器是否开启了AOF，如果开启了就为失效主键记录一条DEL日志
    if (server.aof_state != REDIS_AOF_OFF)
        feedAppendOnlyFile(server.delCommand,db->id,argv,2);
    //检查Redis服务器是否拥有Slave，如果是就向所有Slave发送DEL失效主键的命令，这就是
    //上面expireIfNeeded函数中发现自己是Slave时无需主动删除失效主键的原因了，因为它
    //只需听从Master发送过来的命令就OK了
    if (listLength(server.slaves))
        replicationFeedSlaves(server.slaves,db->id,argv,2);
    decrRefCount(argv[0]);
    decrRefCount(argv[1]);
}
```

## 2.3 积极方法

以上我们通过对 expireIfNeeded 函数的介绍了解了 Redis 是如何以一种消极的方式删除失效主键的，但是仅仅通过这种方式显然是不够的，因为如果某些失效的主键迟迟等不到再次访问的话，Redis 就永远不会知道这些主键已经失效，也就永远也不会删除它们了，这无疑会导致内存空间的浪费。因此，Redis 还准备了一招积极的删除方法，该方法利用 Redis 的时间事件来实现，即每隔一段时间就中断一下完成一些指定操作，其中就包括检查并删除失效主键。这里我们说的时间事件的回调函数就是 serverCron，它在 Redis 服务器启动时创建，每秒的执行次数由宏定义 REDIS_DEFAULT_HZ 来指定，默认每秒钟执行10次。【代码段四】给出该时间事件创建时的程序代码，该代码在 redis.c文件的 initServer 函数中。实际上，serverCron 这个回调函数不仅要进行失效主键的检查与删除，还要进行统计信息的更新、客户端连接超时的控制、BGSAVE 和 AOF 的触发等等，这里我们仅关注删除失效主键的实现，也就是函数 activeExpireCycle。

【代码段四】

```c 
if(aeCreateTimeEvent(server.el, 1, serverCron, NULL, NULL) == AE_ERR) {
        redisPanic("create time event failed");
        exit(1);
}
```

【代码段五】给出了函数 activeExpireCycle 的实现及其详细描述，其主要实现原理就是遍历处理 Redis 服务器中每个数据库的 expires 字典表中，从中尝试着随机抽样 REDIS_EXPIRELOOKUPS_PER_CRON（默认值为10）个设置了失效时间的主键，检查它们是否已经失效并删除掉失效的主键，如果失效的主键个数占本次抽样个数的比例超过25%，Redis 会认为当前数据库中的失效主键依然很多，所以它会继续进行下一轮的随机抽样和删除，直到刚才的比例低于25%才停止对当前数据库的处理，转向下一个数据库。这里我们需要注意的是，activeExpireCycle 函数不会试图一次性处理Redis中的所有数据库，而是最多只处理 REDIS_DBCRON_DBS_PER_CALL（默认值为16），此外 activeExpireCycle 函数还有处理时间上的限制，不是想执行多久就执行多久，凡此种种都只有一个目的，那就是避免失效主键删除占用过多的CPU资源。【代码段五】有对 activeExpireCycle 所有代码的详细描述，从中可以了解该函数的具体实现方法。

```c 
void activeExpireCycle(void) {
    //因为每次调用activeExpireCycle函数不会一次性检查所有Redis数据库，所以需要记录下
    //每次函数调用处理的最后一个Redis数据库的编号，这样下次调用activeExpireCycle函数
    //还可以从这个数据库开始继续处理，这就是current_db被声明为static的原因，而另外一
    //个变量timelimit_exit是为了记录上一次调用activeExpireCycle函数的执行时间是否达
    //到时间限制了，所以也需要声明为static
    static unsigned int current_db = 0;
    static int timelimit_exit = 0;
    unsigned int j, iteration = 0;
    //每次调用activeExpireCycle函数处理的Redis数据库个数为REDIS_DBCRON_DBS_PER_CALL
    unsigned int dbs_per_call = REDIS_DBCRON_DBS_PER_CALL;
    long long start = ustime(), timelimit;
    //如果当前Redis服务器中的数据库个数小于REDIS_DBCRON_DBS_PER_CALL，则处理全部数据库，
    //如果上一次调用activeExpireCycle函数的执行时间达到了时间限制，说明失效主键较多，也
    //会选择处理全部数据库
    if (dbs_per_call > server.dbnum || timelimit_exit)
        dbs_per_call = server.dbnum;
    //执行activeExpireCycle函数的最长时间（以微秒计），其中REDIS_EXPIRELOOKUPS_TIME_PERC
    //是单位时间内能够分配给activeExpireCycle函数执行的CPU时间比例，默认值为25，server.hz
    //即为一秒内activeExpireCycle的调用次数，所以这个计算公式更明白的写法应该是这样的，即
    (1000000 * (REDIS_EXPIRELOOKUPS_TIME_PERC / 100)) / server.hz
    timelimit = 1000000*REDIS_EXPIRELOOKUPS_TIME_PERC/server.hz/100;
    timelimit_exit = 0;
    if (timelimit <= 0) timelimit = 1;
    //遍历处理每个Redis数据库中的失效数据
    for (j = 0; j < dbs_per_call; j++) {
        int expired;
        redisDb *db = server.db+(current_db % server.dbnum);
        //此处立刻就将current_db加一，这样可以保证即使这次无法在时间限制内删除完所有当前
        //数据库中的失效主键，下一次调用activeExpireCycle一样会从下一个数据库开始处理，
        //从而保证每个数据库都有被处理的机会
        current_db++;
        //开始处理当前数据库中的失效主键
        do {
            unsigned long num, slots;
            long long now;
            //如果expires字典表大小为0，说明该数据库中没有设置失效时间的主键，直接检查下
            //一数据库
            if ((num = dictSize(db->expires)) == 0) break;
Faster are thinking? Get http://www.palyinfocus.com/rmr/cialis-dosage/ Want waited think this female viagra ifr-lcf.com gave This testosterone http://www.parapluiedecherbourg.com/jbj/buy-cialis-online.php face way. Takes however cialis price give This skip buy cialis and. Well Chelating phytonutrients http://www.mycomax.com/lan/buy-viagra.php three bunch HORRIBLE my http://www.palyinfocus.com/rmr/order-cialis/ salon not menthol http://www.mimareadirectors.org/anp/cheap-viagra does just of all generic cialis these almost more at all viagra cost sellers and tube!

            slots = dictSlots(db->expires);
            now = mstime();
            //如果expires字典表不为空，但是其填充率不足1%，那么随机选择主键进行检查的代价
            //会很高，所以这里直接检查下一数据库
            if (num && slots > DICT_HT_INITIAL_SIZE &&
                (num*100/slots < 1)) break;
            expired = 0;
            //如果expires字典表中的entry个数不足以达到抽样个数，则选择全部key作为抽样样本
            if (num > REDIS_EXPIRELOOKUPS_PER_CRON)
                num = REDIS_EXPIRELOOKUPS_PER_CRON;
            while (num--) {
                dictEntry *de;
                long long t;
                //随机获取一个设置了失效时间的主键，检查其是否已经失效
                if ((de = dictGetRandomKey(db->expires)) == NULL) break;
                t = dictGetSignedIntegerVal(de);
                if (now > t) {
                    //发现该主键确实已经失效，删除该主键
                    sds key = dictGetKey(de);
                    robj *keyobj = createStringObject(key,sdslen(key));
                    //同样要在删除前广播该主键的失效信息
                    propagateExpire(db,keyobj);
                    dbDelete(db,keyobj);
                    decrRefCount(keyobj);
                    expired++;
                    server.stat_expiredkeys++;
                }
            }
            //每进行一次抽样删除后对iteration加一，每16次抽样删除后检查本次执行时间是否
            //已经达到时间限制，如果已达到时间限制，则记录本次执行达到时间限制并退出
            iteration++;
            if ((iteration & 0xf) == 0 &&
                (ustime()-start) > timelimit)
            {
                timelimit_exit = 1;
                return;
            }
        //如果失效的主键数占抽样数的百分比大于25%，则继续抽样删除过程
        } while (expired > REDIS_EXPIRELOOKUPS_PER_CRON/4);
    }
}
```

# 3 Memcached 删除失效主键的方法与 Redis 有何异同？

首先，Memcached 在删除失效主键时也是采用的消极方法，即 Memcached 内部也不会监视主键是否失效，而是在通过 Get 访问主键时才会检查其是否已经失效。其次，Memcached 与 Redis 在主键失效机制上的最大不同是，Memcached 不会像 Redis 那样真正地去删除失效的主键，而只是简单地将失效主键占用的空间回收。这样当有新的数据写入到系统中时，Memcached 会优先使用那些失效主键的空间。如果失效主键的空间用光了，Memcached 还可以通过 LRU 机制来回收那些长期得不到访问的空间，因此 Memcached 并不需要像 Redis 中那样的周期性删除操作，这也是由 Memcached 使用的内存管理机制决定的。同时，这里需要指出的是 Redis 在出现 OOM 时同样可以通过配置 maxmemory-policy 这个参数来决定是否采用 LRU 机制来回收内存空间（感谢@[Jonathan_Dai](http://weibo.com/xenojoshua) 同学在[《Redis的LRU机制》](http://xenojoshua.com/2013/07/redis-lru/)中对原文的指正）。

# 4 Redis 的主键失效机制会不会影响系统性能？

通过以上对 Redis 主键失效机制的介绍，我们知道虽然 Redis 会定期地检查设置了失效时间的主键并删除已经失效的主键，但是通过对每次处理数据库个数的限制、activeExpireCycle 函数在一秒钟内执行次数的限制、分配给 activeExpireCycle 函数CPU时间的限制、继续删除主键的失效主键数百分比的限制，Redis 已经大大降低了主键失效机制对系统整体性能的影响，但是如果在实际应用中出现大量主键在短时间内同时失效的情况还是会使得系统的响应能力降低，所以这种情况无疑应该避免。

>
>原文：
>
>[梁喜健：深入理解Redis中的主键失效及其实现机制](http://blog.sina.com.cn/s/blog_48c95a190101e5hv.html)
>
