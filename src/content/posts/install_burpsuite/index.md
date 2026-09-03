---
title: "安装Burp Suite"
category: 系统与工具实践
tags:
  - "网络工具"
slug: install_burpsuite
translationKey: "install_burpsuite"
published: 2026-03-11
---

## 在Windows上安装

文件下载：[点我下载](https://ivostation.dpdns.org:8443/s/7b5eb1aaa9f04dbabf)（NAS分享链接，若无法下载，请联系作者：zeyun4699@gmail.com）

## 步骤一：下载来自我上传的文件（你会得到步骤二的图片中的几个文件）

文件说明：old文件夹中含老版本的burp suite（为windows7老系统准备的），正常按照我下面的说明，win10/11的安装最新版的即可（这里我使用window11来进行演示）

必要下载文件：除了old文件夹里面的不用下载，其他的4个文件都需要下载，缺一不可

## 步骤二：双击此文件，安装Java坏境

### 因为我提供的这个burp suite的版本较新，所以这个需要高版本的Java

![](photos/install_burpsuite_1.png)

## 步骤三：开始安装

![](photos/install_burpsuite_2.png)

### 点击继续（选择文件位置，这里我建议可以更换一个自己记得住的路径）

![](photos/install_burpsuite_3.png)

### 完成安装（这里点击关闭即可）

![](photos/install_burpsuite_4.png)

## 步骤四：配置坏境变量

### 依次打开：设置，系统，系统信息，高级系统设置

![](photos/install_burpsuite_5.png)

### 选择环境变量选项

![](photos/install_burpsuite_6.png)

### 依次选择下面图片中的选项

`*注意`：这里的变量名，建议固定为 **`JAVA_HOME`**（不是必须，但强烈推荐，可以为后续省去很多不必要的麻烦）

![](photos/install_burpsuite_7.png)

最后全部选择“确定”选项

## 步骤五：配置用户环境变量

### 按照如下步骤来就行，不要跳步（如果你前面的名称和我一样，那就按照我图片的步骤来即可）

![](photos/install_burpsuite_8.png)

### 将这个环境变量移动至顶部

![](photos/install_burpsuite_9.png)

### 不出意外的话，你配置完，在终端中输入，会显示下图的这个界面

```bash
javac
```

![](photos/install_burpsuite_10.png)

至此，坏境变量部分即为配置成功

## 步骤七：开始安装Burp suite

### 确认下载的这个ini文件数据是否都为0，如果不是，请手动都改成0

![](photos/install_burpsuite_11.png)

### 在此文件夹中，打开CMD窗口（`*注意`：后续的激活中，这个CMD命令窗口不要关闭！）

![](photos/install_burpsuite_12.png)

### 在打开的这个CMD窗口中输入以下命令，回车，会打开一个burp suite破解插件的窗口

```bash
java -jar burploader.jar
```

![](photos/install_burpsuite_13.png)

### 勾选第二个，并点击“RUN”

![](photos/install_burpsuite_14.png)

### 如果不出意外，你会自动打开burp suit的界面（如下图所示）

![](photos/install_burpsuite_15.png)

如果你要是打不开这个窗口，那么就再次在这个文件夹中打开一个新的CMD窗口（`*注意`：之前打开的CMD窗口不要关掉！）

### 输入以下命令，使用终端打开软件

```bash
java -jar burpsuite_pro_v2025.9.5.jar
```

![](photos/install_burpsuite_16.png)

使用CMD命令，也是同样的效果，需要确保两个软件都打开（一个破解的插件，另一个是burp suite软件本体）再进行下一步的操作

### 将左侧的文本复制，粘贴到右侧，随后点击`NEXT`

![](photos/install_burpsuite_17.png)

### 接下来的步骤中，选择“手动激活”选项

![](photos/install_burpsuite_18.png)

### 继续按照以下步骤操作

![](photos/install_burpsuite_19.png)

### 粘贴完成之后，再次点击`NEXT`，即可看到激活成功（如下图所示）

![](photos/install_burpsuite_20.png)

最后点击`Finish`结束安装即可

### 关掉这个窗口之前，请把第一个勾打上（两个都打开也没事）

![](photos/install_burpsuite_21.png)

## 步骤八：后续的准备

### 可以创建一个快捷方式来打开这个软件

![](photos/install_burpsuite_22.png)

或者你也可以写一个脚本，来运行这个软件，效果都一样

## 步骤九：下载证书

按照下图的步骤配置即可

![](photos/install_burpsuite_23.png)

选择下图的框选区域

![](photos/install_burpsuite_24.png)

命名要求必须为`.der`结尾

![](photos/install_burpsuite_25.png)

点击保存即可（下图是我的路径，可供参考）

![](photos/install_burpsuite_26.png)

## 步骤十：配置证书

### 打开浏览器，搜索`证书`（这里我以最普遍的Edge浏览器来示范，其他的浏览器也是同理）

![](photos/install_burpsuite_27.png)

### 打开这个依次打开如下的选项

![](photos/install_burpsuite_28.png)

![](photos/install_burpsuite_29.png)

### 选自刚刚保存的证书路径，找到证书

![](photos/install_burpsuite_30.png)

中间证书配置也是如此（和上面的步骤一致，我就不再演示了）

### 配置好后如下图所示

![](photos/install_burpsuite_31.png)

## 步骤十一：安装浏览器拓展（强烈建议安装这款管理插件，很方便）

### 安装浏览器拓展： `proxy switchyomega`

![](photos/install_burpsuite_32.png)

点击右上角的“拼图”，打开拓展（可以固定到这里，方便开关）

### 按照下图步骤配置插件

![](photos/install_burpsuite_33.png)

### 继续按照下图，来进行配置

![](photos/install_burpsuite_34.png)

最后选择左下角的“应用选项”，保存即可

## 步骤十二：该插件使用的指南

`*注意`：当你选择[burp suite]的时候，浏览器的流量将由burp suite接管，不需要手动去改设置（平时不用的时候，一定要选择[系统代理]，不然会没有网络！）

![](photos/install_burpsuite_35.png)

那么以上就是整个burp suite安装过程，感谢您能看到这里

你的肯定是我更新最大的动力(≧∀≦)ゞ
