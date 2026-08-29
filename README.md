# 云泽の小屋

简体中文 | [English](README_EN.md) | [日本語](README_JA.md)

https://zeyun.org/

一个记录网络技术、Linux、数据库、网络安全和各种工具折腾的个人博客。

## 关于

这里是“云泽の小屋”的源码仓库。

博客主要用于记录学习过程中遇到的问题、技术笔记，以及平时对各种软件、系统和工具的折腾记录。

当前网站基于 Astro 和 Twilight 构建，并通过 GitHub Actions 自动部署到 GitHub Pages。

## 技术栈

* [Astro](https://astro.build/)
* [Twilight](https://github.com/Spr-Aachen/Twilight)
* Svelte
* Tailwind CSS
* Pagefind
* pnpm

部署与基础设施：

* GitHub Actions
* GitHub Pages
* Cloudflare DNS

## 本地开发

安装依赖：

```bash
pnpm install
```

启动本地开发服务器：

```bash
pnpm dev
```

构建静态站点：

```bash
pnpm build
```

具体命令以 `package.json` 中的 scripts 为准。

## 部署

向 `main` 分支推送代码后，GitHub Actions 会执行构建，并将生成的静态站点部署到 GitHub Pages。

正式站点：

https://zeyun.org/

## Credits

本项目基于以下项目构建：

* [Astro](https://astro.build/)
* [Twilight](https://github.com/Spr-Aachen/Twilight)

感谢相关开源项目及其贡献者。

## License

本仓库保留 Twilight 原项目的 MIT License 及原作者版权声明，详见 [`LICENSE`](LICENSE)。

博客文章、图片及其他个人内容不因该许可证自动获得额外授权。
