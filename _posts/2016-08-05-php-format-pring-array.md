---
layout: post
title: "【转载】PHP 格式化数组输出样式"
date: 2016-08-05 22:02
tags: php
category: php
author: Aidan
---

调试php程序的时候，有时候闹不懂PHP数组里面到底是什么，经常要var_dump出来看看，但是复杂的数组dump出来之后堆成一堆可读性奇差无比，下面这段代码可以帮你。

```php
function dump($vars, $label = '', $return = false) {
    if (ini_get('html_errors')) {
        $content = "<pre>\n";
        if ($label != '') {
            $content .= "<strong>{$label} :</strong>\n";
        }
        $content .= htmlspecialchars(print_r($vars, true));
        $content .= "\n</pre>\n";
    } else {
        $content = $label . " :\n" . print_r($vars, true);
    }
    if ($return) { return $content; }
    echo $content;
    return null;
}
```

其中$vars就是你要dump出来的数组。

>原文：
>
>[鸟儿博客 » PHP格式化数组输出样式](http://www.birdol.com/web/751.html)