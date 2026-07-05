# AGENTS.md

## 项目概述

Vue 3 + Vite 前端项目，包管理器为 pnpm。

## 目录结构

- `frontend/` — 应用根目录
- `frontend/src/` — 源码入口
- `frontend/public/` — 静态资源（如背景图片），通过绝对路径 `/xxx` 引用

## 常用命令

所有命令在 `frontend/` 目录下执行：

```bash
pnpm dev        # 启动开发服务器，默认端口 5173
pnpm build      # 生产构建
pnpm preview    # 预览生产构建
```

安装依赖：`pnpm install`（在 `frontend/` 下执行）

## 注意事项

- 背景图 `background.jpg` 放在 `public/` 目录，CSS 中用 `/background.jpg` 引用
- App.vue 使用 `::before` 伪元素实现白色半透明磨砂覆盖层
- 没有配置 ESLint、TypeScript、测试框架
- 没有路由（vue-router 未安装）
