# 云泽の小屋

[简体中文](README.md) | [English](README_EN.md) | 日本語

https://zeyun.org/

ネットワーク技術、Linux、データベース、サイバーセキュリティ、ソフトウェアや各種ツールの試行錯誤を記録する個人ブログです。

## このブログについて

ここは「云泽の小屋」のソースコードリポジトリです。

このブログでは主に、学習中に遭遇した問題、技術メモ、ソフトウェア・システム・各種ツールの試行錯誤を記録しています。

現在のサイトは Astro と Twilight をベースに構築し、GitHub Actions を通じて GitHub Pages に自動デプロイしています。

## 技術スタック

* [Astro](https://astro.build/)
* [Twilight](https://github.com/Spr-Aachen/Twilight)
* Svelte
* Tailwind CSS
* Pagefind
* pnpm

デプロイとインフラ：

* GitHub Actions
* GitHub Pages
* Cloudflare DNS

## ローカル開発

依存関係をインストールします：

```bash
pnpm install
```

ローカル開発サーバーを起動します：

```bash
pnpm dev
```

静的サイトをビルドします：

```bash
pnpm build
```

実際のコマンドについては、`package.json` の scripts を参照してください。

## デプロイ

`main` ブランチにコードをプッシュすると、GitHub Actions がサイトをビルドし、生成された静的ファイルを GitHub Pages にデプロイします。

公開サイト：

https://zeyun.org/

## Credits

このプロジェクトは、以下のプロジェクトをベースに構築しています：

* [Astro](https://astro.build/)
* [Twilight](https://github.com/Spr-Aachen/Twilight)

関連するオープンソースプロジェクトとそのコントリビューターに感謝します。

## License

このリポジトリでは、Twilight のオリジナルプロジェクトの MIT License と原作者の著作権表示を維持しています。詳細は [`LICENSE`](LICENSE) を参照してください。

ブログ記事、画像、その他の個人コンテンツに対して、このライセンスにより追加の利用許諾が自動的に与えられるものではありません。
