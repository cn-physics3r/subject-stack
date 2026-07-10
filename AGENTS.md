# AGENTS.md

## 项目概述

Vue 3 + Vite 前端项目，包管理器 pnpm。无路由、无 TypeScript、无 ESLint、无测试框架。

## 常用命令

所有命令在 `frontend/` 目录下执行：

```bash
pnpm dev       # 开发服务器，端口 5173
pnpm build     # 生产构建
pnpm install   # 安装依赖
```

## 架构要点

- 组件树扁平：`App.vue` 平铺 4 个子组件（`Capsule` / `DateTimeCapsule` / `CardStack` / `AnimationControl`），无嵌套路由，无状态管理库
- 拖拽排序依赖 `vuedraggable@4`（封装 SortableJS），是唯一的非框架依赖
- 卡片堆用 `flex-flow: column wrap` 实现多列瀑布式排列，**不是 grid**
- 公共静态资源放 `frontend/public/`，代码中通过绝对路径引用（如 `/background.jpg`）

## 关键实现细节（改动时需注意）

### config.json 注入
`vite.config.js` 通过虚拟模块插件将根目录 `config.json`（含应用名和版本号）注入为 `virtual:app-config`。`Capsule.vue` 通过 `import config from 'virtual:app-config'` 引用，不依赖 dev server 的 `fs.allow`。

### 组件间动画时长联动（composable provide/inject）
`App.vue` 在 `<script setup>` 中调用 `createAnimationState()`，通过 Vue 的 `provide` 向子孙组件注入共享的 `duration` ref 和 `setDuration` 方法。各子组件通过 `useAnimationDuration()` composable 以 `inject` 获取同一份状态——**这是一个基于 Vue DI 的隐式跨组件通信通道**，没有用 props/eventBus。注：`isAnimating` 为 `CardStack` 局部状态，通过 prop 传给 `CardItem`，不在此 composable 中共享。

### FLIP 展开/收起动画（CardStack.vue）
点击卡片标题触发展开/收起时，下方卡片会平滑滑到新位置。`toggleExpand` 手动实现了 FLIP：
1. `captureRects()` 记录所有卡片的当前位置
2. `measureFinalRects()` 临时将 body 高度设为目标值、强制 reflow、读取最终位置后恢复
3. `animateHeightAndFLIP()` 用 `requestAnimationFrame` 同时驱动 body 高度补间和卡片 transform 位移补偿
4. 动画未完成时再次触发会先 `cancelActiveAnim()`，将上一个 body 强制跳到终态然后开新动画（拖拽开始时也会调用 `cancelActiveAnim()`，该逻辑抽取为一个共享函数）

### 拖拽与点击的隔离
拖拽手柄 `.drag-handle` 上有 `@click.stop` 阻止冒泡。此外 `onDragEnd` 后置 `suppressClick = true`，`animDuration.value` 后解除——**拖拽松手时常会伴随一个 click 事件**，这个 supressClick 防止该 click 误触发卡片展开。如果修改拖拽或点击逻辑，这个机制容易被遗漏。

### 毛玻璃样式统一范式
所有胶囊（Capsule / DateTimeCapsule / AnimationControl）和卡片（CardItem）共用同一套风格：
```css
background: rgba(255,255,255,0.15~0.2);
backdrop-filter: blur(12~20px);
border-radius: 999px; /* 胶囊用 */
border: 0.5px solid rgba(255,255,255,0.25~0.35);
```
App.vue 用 `::before` 伪元素 + `rgba(255,255,255,0.3)` + `blur(10px)` 做全屏磨砂罩。新增 UI 应沿用此风格。

### CardItem 内容自适应
`CardItem.vue` 用 `ResizeObserver` 监听 `.card-body-inner`，当卡片处于展开态且内容高度变化时，自动更新 `body.style.height` 为 `scrollHeight`。

### 时间胶囊
`DateTimeCapsule.vue` 用递归 `setTimeout` 对齐秒边界刷新，格式 `MM/DD | HH:MM:SS`。组件卸载时 `clearTimeout`。

## 特别注意

- **没有 lint/typecheck/test 命令**，提交前只能靠 `pnpm build` 验证编译通过
- `pnpm-workspace.yaml` 仅含 `allowBuilds: {esbuild: true}`，为 Vite 在 Windows 上预构建依赖所需
- `vue` 和 `vuedraggable` 已预构建在 `node_modules/.vite/deps/` 中，修改依赖版本后需删掉该目录让 Vite 重建
