---
layout: post
title: "【总结】位移运算符详解"
date: 2016-07-16 21:45
tags: operators
category: javascript
author: Aidan
---

当有人问你`>>`、`>>>`、`<<`是什么时，那你都不知道，那不是`无符号右移`、`有符号右移`和`左移`嘛！当你说出来时你真的懂了吗？这三个符号中文翻译那么苍白无力，真是坑苦了人。今天我们来真正搞明白这三个运算符吧！

# 1 计算机中的数字

计算机中数字都是采用二进制来表示，并且`计算机中有符号数都是用补码形式表示`。这是由设计计算机的前辈想出来的方法，当然也取决与计算电路的性能。

## 1.1 机器数和真值

在学习原码, 反码和补码之前, 需要先了解机器数和真值的概念.

### 1.1.1 机器数

一个数在计算机中的二进制表示形式,  叫做这个数的机器数。机器数是带符号的，在计算机用一个数的最高位存放符号, 正数为0, 负数为1.

比如，十进制中的数 +3 ，计算机字长为8位，转换成二进制就是 00000011。如果是 -3 ，就是 10000011 。

那么，这里的 00000011 和 10000011 就是机器数。

### 1.1.2 真值

因为第一位是符号位，所以机器数的形式值就不等于真正的数值。例如上面的有符号数 10000011，其最高位1代表负，其真正数值是 -3 而不是形式值131（10000011 转换成十进制等于131）。所以，为区别起见，将带符号位的机器数对应的真正数值称为机器数的真值。

例如：

0000 0001 的真值 = +000 0001 = +1
1000 0001 的真值 = –000 0001 = –1

## 1.2 原码、反码、补码的基础概念和计算方法

### 1.2.1 原码

原码就是符号位加上真值的绝对值, 即用第一位表示符号, 其余位表示值. 比如如果是8位二进制:

```
[+1]~原~ = 0000 0001

[-1]~原~ = 1000 0001
```

第一位是符号位. 因为第一位是符号位, 所以8位二进制数的取值范围就是:

```
[1111 1111 , 0111 1111]
```

即

```
[-127 , 127]
```

原码是人脑最容易理解和计算的表示方式.

### 1.2.1 反码

反码的表示方法是:

- 正数的反码是其本身

- 负数的反码是在其原码的基础上, 符号位不变，其余各个位取反.

```
[+1] = [0000 0001]~原~ = [0000 0001]~反~

[-1] = [1000 0001]~原~ = [1111 1110]~反~
```

可见如果一个反码表示的是负数, 人脑无法直观的看出来它的数值. 通常要将其转换成原码再计算.

### 1.2.3 补码

补码的表示方法是:

- 正数的补码就是其本身

- 负数的补码是在其原码的基础上, 符号位不变, 其余各位取反, 最后 +1. (即在反码的基础上 +1)

```
[+1] = [0000 0001]~原~ = [0000 0001]~反~ = [0000 0001]~补~

[-1] = [1000 0001]~原~ = [1111 1110]~反~ = [1111 1111]~补~
```

对于负数, 补码表示方式也是人脑无法直观看出其数值的. 通常也需要转换成原码在计算其数值.

## 1.3 为何要使用原码、反码和补码

在开始深入学习前, 我的学习建议是先"死记硬背"上面的原码, 反码和补码的表示方式以及计算方法.

现在我们知道了计算机可以有三种编码方式表示一个数. 对于正数因为三种编码方式的结果都相同:

```
[+1] = [0000 0001]~原~ = [0000 0001]~反~ = [0000 0001]~补~
```

所以不需要过多解释. 但是对于负数:

```
[-1] = [1000 0001]~原~ = [1111 1110]~反~ = [1111 1111]~补~
```

可见原码, 反码和补码是完全不同的. 既然原码才是被人脑直接识别并用于计算表示方式, 为何还会有反码和补码呢?

首先, 因为人脑可以知道第一位是符号位, 在计算的时候我们会根据符号位, 选择对真值区域的加减. (真值的概念在本文最开头). 但是对于计算机, 加减乘数已经是最基础的运算, 要设计的尽量简单. 计算机辨别"符号位"显然会让计算机的基础电路设计变得十分复杂! 于是人们想出了将符号位也参与运算的方法. 我们知道, 根据运算法则减去一个正数等于加上一个负数, 即: 1-1 = 1 + (-1) = 0 , 所以机器可以只有加法而没有减法, 这样计算机运算的设计就更简单了.

于是人们开始探索 将符号位参与运算, 并且只保留加法的方法. 首先来看原码:

计算十进制的表达式: 1-1=0

```
1 - 1 = 1 + (-1) = [0000 0001]~原~ + [1000 0001]~原~ = [1000 0010]~原~ = -2
```

如果用原码表示, 让符号位也参与计算, 显然对于减法来说, 结果是不正确的.这也就是为何计算机内部不使用原码表示一个数.

为了解决原码做减法的问题, 出现了反码:

计算十进制的表达式: 1-1=0

```
1 - 1 = 1 + (-1) = [0000 0001]~原~ + [1000 0001]~原~= [0000 0001]~反~ + [1111 1110]~反~ = [1111 1111]~反~ = [1000 0000]~原~ = -0
```

发现用反码计算减法, 结果的真值部分是正确的. 而唯一的问题其实就出现在"0"这个特殊的数值上. 虽然人们理解上+0和-0是一样的, 但是0带符号是没有任何意义的. 而且会有[0000 0000]原和[1000 0000]原两个编码表示0.

于是补码的出现, 解决了0的符号以及两个编码的问题:

```
1-1 = 1 + (-1) = [0000 0001]~原~ + [1000 0001]~原~ = [0000 0001]~补~ + [1111 1111]~补~ = [0000 0000]~补~=[0000 0000]~原~
```

这样0用[0000 0000]表示, 而以前出现问题的-0则不存在了.而且可以用[1000 0000]表示-128:

(-1) + (-127) = [1000 0001]~原~ + [1111 1111]~原~ = [1111 1111]~补~ + [1000 0001]~补~ = [1000 0000]~补~

-1-127的结果应该是-128, 在用补码运算的结果中, [1000 0000]~补~ 就是-128. 但是注意因为实际上是使用以前的-0的补码来表示-128, 所以-128并没有原码和反码表示.(对-128的补码表示[1000 0000]补算出来的原码是[0000 0000]~原~, 这是不正确的)

使用补码, 不仅仅修复了0的符号以及存在两个编码的问题, 而且还能够多表示一个最低数. 这就是为什么8位二进制, 使用原码或反码表示的范围为[-127, +127], 而使用补码表示的范围为[-128, 127].

因为机器使用补码, 所以对于编程中常用到的32位int类型, 可以表示范围是: [-2^31^, 2^31^-1] 因为第一位表示的是符号位.而使用补码表示时又可以多保存一个最小值.

# 2 Bitwise shift operators（按位移动操作符）

>The bitwise shift operators take two operands: the first is a quantity to be shifted, and the second specifies the number of bit positions by which the first operand is to be shifted. The direction of the shift operation is controlled by the operator used.
>
>Shift operators convert their operands to 32-bit integers in big-endian order and return a result of the same type as the left operand. The right operand should be less than 32, but if not only the low five bits will be used.

## 2.1 C++ 中的 Bitwise shift operators（按位移动操作符）

>This operator shifts the first operand the specified number of bits to the left. Excess bits shifted off to the left are discarded. Zero bits are shifted in from the right.

### 2.1.1 C++ 中的 Left shift 

例1：（本文例子都采用有符号32位二进制数，当然计算机中存储的都是补码。即：最高位为符号位）

```
00000 00000 00000 00000 00000 00010 11 << 2
-------------------------------------------
00000 00000 00000 00000 00000 01011 00

11 >> 2 = 44
```

Bitwise shifting any number x to the left by y bits yields x * 2^y.

整数的 `left shift` 就不多少了，很简单；但真正`left shift`的是补码。从 left of any number x `shift` y bits, adding 0 to this number right。

测试如下：

```C
#include <iostream>
#include <bitset>

using namespace std;

main(){
	
	int bit = 2;
	signed int num1 = 11;
	signed int num1_1 = ~num1;
	signed int num1_2 = num1 << bit;
	
	cout << "base(10):	" << num1 << endl;
	cout << "base(2):	" << bitset<32>(num1) << endl;
	cout << "~base(2):	" << bitset<32>(num1_1) << endl;
	cout << "base(2) << " << bit << ":	" << bitset<32>(num1_2) << endl;
	cout << "base(10) << " << bit << ":	" << num1_2 << endl;
	
	return 0;
}
```

结果：

![测试](/asset/images/writing/2016-07-16-bitwise-shift-operators/2016-07-17_105738.png)

再看一个测试：

```C
#include <iostream>
#include <bitset>

using namespace std;

main(){
	
	int bit = 28;
	signed int num1 = 11;
	signed int num1_1 = ~num1;
	signed int num1_2 = num1 << bit;
	
	cout << "base(10):	" << num1 << endl;
	cout << "base(2):	" << bitset<32>(num1) << endl;
	cout << "~base(2):	" << bitset<32>(num1_1) << endl;
	cout << "base(2) << " << bit << ":	" << bitset<32>(num1_2) << endl;
	cout << "base(10) << " << bit << ":	" << num1_2 << endl;
	
	return 0;
}
```

结果：

![测试](/asset/images/writing/2016-07-16-bitwise-shift-operators/2016-07-17_110134.png)


例2：（我们来看看一个负数左移）


```
10000 00000 00000 00000 00000 00010 11  // 原码 
11111 11111 11111 11111 11111 11101 00	// 反码
11111 11111 11111 11111 11111 11101 01 << 2	 // 补码
-------------------------------------------
111 11111 11111 11111 11111 11101 0100 

-11 << 2 = -44
```

测试如下：

```C
#include <iostream>
#include <bitset>

using namespace std;

main(){
	
	int bit = 2;
	signed int num1 = -11;
	signed int num1_1 = ~num1;
	signed int num1_2 = num1 << bit;
	
	cout << "base(10):	" << num1 << endl;
	cout << "base(2):	" << bitset<32>(num1) << endl;
	cout << "~base(2):	" << bitset<32>(num1_1) << endl;
	cout << "base(2) << " << bit << ":	" << bitset<32>(num1_2) << endl;
	cout << "base(10) << " << bit << ":	" << num1_2 << endl;
	
	return 0;
}
```

结果：

![测试](/asset/images/writing/2016-07-16-bitwise-shift-operators/2016-07-17_110459.png)

再看一个测试：

```C
#include <iostream>
#include <bitset>

using namespace std;

main(){
	
	int bit = 28;
	signed int num1 = -11;
	signed int num1_1 = ~num1;
	signed int num1_2 = num1 << bit;
	
	cout << "base(10):	" << num1 << endl;
	cout << "base(2):	" << bitset<32>(num1) << endl;
	cout << "~base(2):	" << bitset<32>(num1_1) << endl;
	cout << "base(2) << " << bit << ":	" << bitset<32>(num1_2) << endl;
	cout << "base(10) << " << bit << ":	" << num1_2 << endl;
	
	return 0;
}
```

结果：

![测试](/asset/images/writing/2016-07-16-bitwise-shift-operators/2016-07-17_111028.png)


同样式左边 `shift` bit,右边 `push` 0。无符号数是同样的道理。

可以这样简单的理解， 我们把待 `left shift` 的数（在强调下是：补码；计算机中的数存储的一定是补码）看做一个数组，然后对数组做 `shift()` 和 `push(0)`操作

C++ 中的左移，不论它是 `有符号` 还是 `无符号` 的类型只要按照上面的理解操作即可。

### 2.1.2 C++ 中的 Right shift 

无符号数的右移：我们把待 `Right shift` 的数（在强调下是：补码；计算机中的数存储的一定是补码）看做一个数组，然后对数组做 `shift()` 和 `push(0)`操作

有符号数的右移：我们把待 `Right shift` 的数（在强调下是：补码；计算机中的数存储的一定是补码）看做一个数组，然后对数组做 `shift()` 和 `push(1)`操作（即 push(符号位)，目的是保留原数的符号）

测试如下：

```C
#include <iostream>
#include <bitset>

using namespace std;

main(){
	
	int bit = 3;
	
	signed int num1 = -11;
	signed int num1_1 = ~num1;
	signed int num1_2 = num1 >> bit;
	
	cout << "Right shift of signed:" << endl;
	cout << "base(10):	" << num1 << endl;
	cout << "base(2):	" << bitset<32>(num1) << endl;
	cout << "~base(2):	" << bitset<32>(num1_1) << endl;
	cout << "base(2) << " << bit << ":	" << bitset<32>(num1_2) << endl;
	cout << "base(10) << " << bit << ":	" << num1_2 << endl;
	
	cout << "**************************************************" << endl;
	
	unsigned int num2 = -11;
	unsigned int num2_1 = ~num2;
	unsigned int num2_2 = num2 >> bit;
	
	cout << "Right shift of unsigned:" << endl;
	cout << "base(10):	" << num2 << endl;
	cout << "base(2):	" << bitset<32>(num2) << endl;
	cout << "~base(2):	" << bitset<32>(num2_1) << endl;
	cout << "base(2) << " << bit << ":	" << bitset<32>(num2_2) << endl;
	cout << "base(10) << " << bit << ":	" << num2_2 << endl;
	
	return 0;
}
```

结果：

![测试](/asset/images/writing/2016-07-16-bitwise-shift-operators/2016-07-17_131244.png)


## 2.2 javascript 中的 Bitwise shift operators（按位移动操作符） 


### 2.2.1  `<<` Left shift

和 C++ 中 Left shift 完全一样

### 2.2.2 `>>` Sign-propagating right shift

Sign-fill right shift（对应 C++ 中的有符号数的右移）

### 2.2.3 `>>>` Zero-fill right shift

Zero-fill right shift（对应 C++ 中的无符号数的右移）