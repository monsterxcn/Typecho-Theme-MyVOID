<h1 align="center">Typecho Theme VOID</h1><h3 align="center">✏ 一款简洁优雅的 Typecho 主题</h3></br></br>


作为计算机术语时，VOID 的意思是「无类型」。要了解原版 VOID 主题，请先阅读介绍文章《[VOID：现在可以公开的情报](https://blog.imalan.cn/archives/247/)》、特色演示《[示例页面](https://blog.imalan.cn/archives/194/)》以及原 GitHub 仓库说明《[AlanDecode/Typecho-Theme-VOID](https://github.com/AlanDecode/Typecho-Theme-VOID)》，本仓库结构、使用方式与原主题相同，请不要直接下载仓库使用，如果你一定要下载仓库，那么请切换 nightly 分支。

本仓库是我从原主题 Commit [4931ecb](https://github.com/AlanDecode/Typecho-Theme-VOID/commit/4931ecb4e3ce21761afaf2fc9f2e414311d2b20a) on Mar 18, 2020 之后的 git 地址导入的，所以显示了所有 Alan 大佬的 commit history 。至于不 fork 是因为 fork 仓库修改时似乎无法显示我的 Contributions。本仓库的二次开发主要是 **一些针对自用需求的修改** ，所以可能无法像原主题一样适合更多人。而且由于我技术不精，很多地方使用了仿写的方式来实现功能、部分地方代码写的可能不规范、也可能出现莫名其妙的 Bug，请谨慎将本主题投入生产环境。关于本仓库与原主题仓库代码的同步策略：凡是原主题无关样式调整的 commit 本主题都将及时同步，其余看心情同步。关于版本号：从 3.4.1 版本（此版本更新内容基本涵盖了原主题 3.5.0 版本绝大部分修改）为起点发布，所有版本号不会比原主题版本号更高。

如果你使用了本主题且发现 Bug 请务必提出 issues 让我知道。如果你对本仓库某处的修改非常不满意，也请大胆地提出 issues 抨击我以使我停止开发。

![Build](https://img.shields.io/github/workflow/status/monsterxcn/Typecho-Theme-VOID/Build?style=flat-square)  ![Download](https://img.shields.io/github/downloads/monsterxcn/Typecho-Theme-VOID/total?style=flat-square)  ![Release](https://img.shields.io/github/v/release/monsterxcn/Typecho-Theme-VOID?style=flat-square)  ![License](https://img.shields.io/github/license/monsterxcn/Typecho-Theme-VOID?label=GLWTPL&style=flat-square)

## 特性

<details><summary>原始特性</summary><br>

* 响应式设计
* PJAX 无刷新体验
* AJAX 评论
* 前台无跳转登陆（兼容 PJAX）
* 自动夜间模式
* 优秀的可读性
* 衬线、非衬线两种文字风格
* 代码高亮（浅色暗色两种风格，随主题切换）
* Mac 风格代码块（可开启或关闭）
* 代码行号
* 站点样式设置面板（日夜转换、字体、字号）
* MathJax 公式
* 表情解析（文章、评论可用）
* 图片排版（可用作相册）
* 图片懒加载
* 灵活的头图设置
* 文章目录解析
* 完整的结构化数据支持
* 够用的后台设置与丰富的高级设置

</details>

<details><summary>插件功能</summary><br>

* 浏览量统计
* 文章点赞
* 文章字数统计
* 评论投票与自动折叠
* 访客互动展示

</details>

## 更新动态

### 2020-05-09

* 新增：主题设置备份

更多：[change-log.md](https://github.com/monsterxcn/Typecho-Theme-VOID/blob/master/change-log.md)

### 待办清单

 - [ ] [MathJax v3](https://github.com/mathjax/MathJax) 支持
 - [ ] [MermaidJs](https://github.com/mermaid-js/mermaid) 支持
 - [ ] `.theme-dark` 优化
 - [ ] CDN 配置优化
 - [ ] Links 随机输出
 - [x] 主题设置备份
 - [x] Artalk 评论实验性兼容
 - [x] Progressive Web Apps
 - [x] 网页压缩
 - [x] 更丰富的表情
 - [x] 静态资源 CDN 设置
 - [x] 一言 API
 - [x] GitHub&QQ 账号快速评论
 - [x] Instantpage v3.0
 - [x] 独立页面模板
 - [x] Console 统一样式输出版权

自己写出来的问题：

 - [ ] Pjax 下网页压缩 `function` 报错
 - [ ] `.macStyleCodeBlock .yue pre::before` 与 `.OwO .OwO-body` `z-index` 层叠布局冲突
 - [x] Artalk 评论系统 Pjax 加载
 - [x] 独立页面文章末尾赞赏与分享显示问题
 - [x] Service Worker 缓存 OwO 表情（需自行开启）
 - [x] 自定义快速评论调用接口
 - [x] 在主题中调用插件产生的 ExSearch json 地址

## 开发与自定义

<details><summary><b>You are on your own.</b></summary><br>

> This Is A Fork From [AlanDecode/Typecho-Theme-VOID](https://github.com/AlanDecode/Typecho-Theme-VOID) But Show My Contributions.

指引：安装 NodeJS 环境 > clone repo > 安装依赖 > 打包依赖的 JavaScript & CSS > 你构建的主题

 - 关于安装 node-sass 出错请参考《 [安装 node-sass 的正确姿势 - Issue #28 - lmk123/blog](https://github.com/lmk123/blog/issues/28) 》
 - 如果需要你可以尝试在主题仓库根目录下执行 `rm -rf node-modules package-lock.json` 后再安装依赖
 - 如果你对自己的更改很满意或者有很妙的修改想法，**欢迎提出 Pull Request 或 Issues**

```bash
git clone https://github.com/monsterxcn/Typecho-Theme-VOID ./VOID && cd ./VOID

# 使用 cnpm 请参考
alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/mirrors/node \
--userconfig=$HOME/.cnpmrc"

# 安装依赖
npm install -g gulp
npm install

# 打包依赖的 JS 和 CSS
gulp dev

# 构建主题，生成的主题位于 ./build 目录下
gulp build

# 主题的样式是用 SCSS 写的
# 使用喜欢的方式编译 SCSS，或者使用这个
gulp sass

# 监听 SCSS 更改然后实时编译。
# 尽请添加自己想要的功能，满意后就提交代码。然后：
gulp build
```

</details>

## 鸣谢

[JQuery](https://github.com/jquery/jquery) | [PrismJS](https://prismjs.com/index.html) | [MathJax](https://www.mathjax.org/) | [fancyBox](http://fancyapps.com/fancybox/3/) | [bigfoot.js](http://www.bigfootjs.com/) | [OwO](https://github.com/DIYgod/OwO) | [pjax](https://github.com/defunkt/jquery-pjax) | [yue.css](https://github.com/lepture/yue.css) | [tocbot](https://tscanlin.github.io/tocbot/) | [pangu.js](https://github.com/vinta/pangu.js) | [social](https://github.com/lepture/social) | [Headroom.js](http://wicky.nillia.ms/headroom.js/) | [hypher](https://github.com/bramstein/hypher) | [Artalk](https://github.com/qwqcode/Artalk)

[RAW](https://github.com/AlanDecode/Typecho-Theme-RAW) | [Mirages](https://get233.com/archives/mirages-intro.html) | [handsome](https://www.ihewro.com/archives/489/) | [Card](https://blog.shuiba.co/bitcron-theme-card) | [Casper](https://github.com/TryGhost/Casper) | [Typlog](https://typlog.com/)

## 捐助

**如果本项目对你有所帮助，请考虑捐助 [AlanDecode](https://https://github.com/AlanDecode/Typecho-Theme-VOID)**

## License

MIT © [AlanDecode](https://github.com/AlanDecode)

GLWT © [monsterxcn](https://github.com/monsterxcn)
