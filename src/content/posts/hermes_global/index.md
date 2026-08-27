---
title: "使用 PVE 内网部署 Hermes Agent"
category: Ai 工具推荐
tags:
  - "AI"
slug: hermes_global
translationKey: "hermes_global"
published: 2026-07-15
---

## 前言：

首先需要注意的是，本教程适用于具有科学上网环境的用户进行使用，如果您没有科学上网的环境，请点击此链接，进行离线安装教程：[点我前往离线安装篇](#)

**本篇教程会从零基础的 Hermes 安装部署，再到与 Telegram Bot 对接**

## 搭建环境推荐：

- 一台可以做到长期不关机的电脑（如果宿主机断了，你的Ai对话也就断了）
- 需要你有一个 Telegram 账户（以便于开通Telegram Bot）
- 安装Hermes的电脑的系统需要为Linux（无需图形化界面）
- Linux系统可以科学上网（需要拉取 Hermes 相关包）

## 本教程的示例配置如下

- 使用 Proxmox Virtual Environment 9.1.6
- Hermes 所占用资源分配为：CPU R7 4750U，2core，4GB RAM 40GB ROM
- 系统为 Ubuntu 24.04.4-live-server-amd64

## 我的相关配置思路如下

- 科学上网配置，我这里使用的是 ImmortalWrt ，作为软路由整个 PVE 网络的出口，管辖所有的虚拟机（其中包括 Hermes 的宿主机）
- 网段我选择的是 ImmortalWrt 作为接入家庭网络的旁路由，具有固定的家庭网络同网段IP（主路由下发的IP 192.168.31.11）Hermes 则是使用的是由 ImmortalWrt 划分出来的新子网（10.10.10.0网段）
- [点我跳转关于 ImmortalWrt+WireGuard 跨网段配置部分](/posts/use_wireguard_home_to_home/)
- [点我跳转 Ubuntu server的安装部分](/posts/security_enhancement_of-cloud_servers/)

**这里我直接跳过科学上网配置以及虚拟机安装的相关部分，默认你已经具备了远程ssh连接上机器这台Linux，并且这台机器具备科学上网的能力**

**（关于Ubuntu系统安装配置部分，可跳转我的博客相关文章）**

## 第一部分：拉取Hermes-Agent官方脚本

stp1：更新包管理器

```bash
sudo apt update
```

stp2：拉取安装脚本

```bash
curl -fsSLO https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh
```

stp3：查看脚本

```bash
less install.sh
```

如果显示以下内容即为成功拉取脚本

![](photos/hermes_global_1.png)

stp4：按下键盘的`q`，退出查看

执行以下命令，进行安装

```bash
bash install.sh
```

会自动拉取一长串脚本里的内容

![](photos/hermes_global_2.png)

耐心等待进度条跑完

## 第二部分：开始按照脚本部署Hermes

### 如果中途出现意外打断脚本的情况（例如不小心或者出现卡死，按下了ctrl+c）可查看本部分的末尾，自行恢复

stp1：这里一步骤输入y，安装**Playwright**（一个浏览器自动化工具库），用来给 Hermes 的"浏览器工具"（browser tools）功能提供支持

![](photos/hermes_global_3.png)

stp2：按向下键，选择`Full setup`选项

![](photos/hermes_global_4.png)

stp3：按需选择对应模型

![](photos/hermes_global_5.png)

这里我选择DeepSeek作为演示（DeepSeek API：[点我前往官方购买](https://platform.deepseek.com/)）

`*建议`：第一次买的话，不要买多，10块钱的就可以了

stp4：填入你的API KEY，并再次按下回车

![](photos/hermes_global_6.png)

stp5：模型选择部分，这里我选择v4-flash（v4-pro太烧token，选择flash我认为完全够用）

![](photos/hermes_global_7.png)

stp6：除非你有特殊需求，否则这里直接选择最后一个即可

![](photos/hermes_global_8.png)

stp7：对接部分，这里选择Telegram，并按下空格，再次回车即可

![](photos/hermes_global_9.png)

stp8：这里我们选择2，使用官方的Bot Father来进行对接

![](photos/hermes_global_10.png)

stp9：打开你的网页版 Telegram（手机端也是同理）

搜索@botfather（注意是下图的这个，后面有一个紫色小勾的，不是其他的）

![](photos/hermes_global_11.png)

stp10：获取 Token API & User id

打开这个对话后，依次输入

```bash
/start
```

创建新机器人

```bash
/newbot
```

他会让你给你的机器人取一个独一无二的名字

![](photos/hermes_global_12.png)

你的名称格式必须要以`_bot`结尾

例如我这里取名是

```bash
fsdertest_bot
你的名字+_bot
```

随后你会看到独属于你的机器人发给你的密钥（注意，千万不要泄露！！！）

![](photos/hermes_global_13.png)

把他复制粘贴给之前的终端里，按下回车，他会让你输入你的 User ID

![](photos/hermes_global_14.png)

你需要继续搜索这个叫做`@userinfobot`

注意，这里要选择前面有这个白色皇冠认证的

![](photos/hermes_global_15.png)

随后向他发送

```bash
/start
```

你就会看到你的ID，复制并粘贴到这之前的终端里

![](photos/hermes_global_16.png)

stp11：选择bot的接收频道

- 如果你**只想通过 Telegram 私聊**跟 Hermes 交互，接收所有通知 → 输入 `Y`
- 如果你以后打算让 Hermes 把消息发到某个**群组或频道**而不是私聊 → 输入 `n`，然后系统会让你手动填别的频道/群组 ID
- **把 Hermes 的"网关"（gateway）注册成 systemd 服务**，也就是让它常驻后台运行，开机自启

![](photos/hermes_global_17.png)

默认的话和我一样都输入`Y`，即可

stp12：设置网关为系统服务

![](photos/hermes_global_18.png)

如果你想自己管理他的启动，那么就选择第二个跳过

stp13：是否现在启动

![](photos/hermes_global_19.png)

这里直接输入Y（或者默认回车），即可

stp14：根据自己的需求，进行对应的功能性质选择  
我的选择如下，仅供参考

![](photos/hermes_global_20.png)

stp15：选择内置浏览器

![](photos/hermes_global_21.png)

直接默认免费的即可（如果你有对应的API，也可使用其他的）

下一步直接回车即可

![](photos/hermes_global_22.png)

stp16：选择搜索引擎

![](photos/hermes_global_23.png)

选择和我上图一样的，免费的即可

stp17：选择 Telegram 工具

![](photos/hermes_global_24.png)

我的建议是取消勾选画图和图像识别（如果你有API，那可以使用）

stp18：再次选择浏览器提供商

![](photos/hermes_global_25.png)

这里将会显示`[active]`激活状态

stp19：语言转文字服务提供商

![](photos/hermes_global_26.png)

这里直接默认免费的即可

stp20：再次确认搜索引擎

![](photos/hermes_global_27.png)

这里将会显示`[active]`激活状态

## 第三部分：最终确认配置

![](photos/hermes_global_28.png)

这会自动把网关配置为我们在最开始提到的后台服务（如 Systemd 用户服务），让它能够一直在后台稳定守候、处理消息，即使你关掉终端也不会断线

`*温馨提示`：如果Ctrl+C 打断了配置怎么办

或者后续脚本遇到了任何意外所导致的退出，那么请你先输入以下的命令

```bash
source ~/.bashrc
```

**可以再次按照当前进度，输入对应的恢复方式**：

| 命令 | 只重配这一部分 |
| --- | --- |
| `hermes setup` | 完整向导（全部重来） |
| `hermes setup tools` | 只配工具 |
| `hermes setup model` | 只配模型/provider |
| `hermes setup gateway` | 只配消息平台 |
| `hermes setup terminal` | 只配 terminal backend |

### 可自行根据上述的表格来进行自己恢复对应的进度

## 与你的机器人聊天部分

再次在 Telegram 里搜索刚刚创建的机器人名字，就能找到你的机器人，并可以成功聊天

![](photos/hermes_global_29.png)

尝试聊天试试

![](photos/hermes_global_30.png)

成功🎉🎉🎉

至此本教程结束，感谢您的观看，我们下一篇再见😎
