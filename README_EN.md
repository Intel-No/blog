# 云泽の小屋

[简体中文](README.md) | English | [日本語](README_JA.md)

https://zeyun.org/

A personal blog documenting networking, Linux, databases, cybersecurity, and various experiments with software and tools.

## About

This is the source repository for “云泽の小屋”.

The blog is mainly used to document problems encountered while learning, technical notes, and experiments with software, systems, and tools.

The site is built with Astro and Twilight, and is automatically deployed to GitHub Pages through GitHub Actions.

## Tech Stack

* [Astro](https://astro.build/)
* [Twilight](https://github.com/Spr-Aachen/Twilight)
* Svelte
* Tailwind CSS
* Pagefind
* pnpm

Deployment and infrastructure:

* GitHub Actions
* GitHub Pages
* Cloudflare DNS

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Build the static site:

```bash
pnpm build
```

Refer to the scripts in `package.json` for the exact commands.

## Deployment

When code is pushed to the `main` branch, GitHub Actions builds the site and deploys the generated static files to GitHub Pages.

Live site:

https://zeyun.org/

## Credits

This project is built on:

* [Astro](https://astro.build/)
* [Twilight](https://github.com/Spr-Aachen/Twilight)

Thanks to these open-source projects and their contributors.

## License

This repository retains the MIT License and original copyright notice from the upstream Twilight project. See [`LICENSE`](LICENSE).

The license does not automatically grant additional permissions for blog posts, images, or other personal content.
