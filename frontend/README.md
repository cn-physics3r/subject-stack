# Subject Stack

Subject Stack 是一个面向触屏希沃白板的卡片堆叠页面。卡片会按列自上而下排列，可通过触摸拖拽调整顺序，也可点击标题展开或收起内容。

## 使用场景

- 主要运行在带触摸屏的希沃白板上。
- 交互优先针对直接触摸和拖拽设计。
- 卡片标题保留基础键盘操作能力，但拖拽排序不以纯键盘操作为目标。
- 桌面布局使用多列卡片流；窄屏设备切换为单列纵向滚动。

## 技术栈

- Vue 3
- Vite 5
- pnpm
- `vuedraggable` / SortableJS
- Playwright 端到端测试

## 环境要求

- Node.js 22 或更高版本
- pnpm 11（项目当前指定 `pnpm@11.3.0`）
- 系统已安装 Google Chrome（运行 Playwright 测试时需要）

如果尚未安装 pnpm，可以使用 npm 安装项目指定版本：

```bash
npm install --global pnpm@11.3.0
```

## 本地开发

所有命令都需要在 `frontend/` 目录执行：

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器默认地址为 <http://localhost:5173>。

## 构建与测试

```bash
pnpm build
pnpm test:e2e
```

Playwright 会自动启动开发服务器，并使用系统 Chrome 执行回归测试。

## 主要功能

- 触摸拖拽卡片手柄调整顺序
- 点击卡片标题展开或收起内容
- View Transition 动画平滑处理卡片展开、换列和位置变化
- 可调节展开、收起及拖拽动画时长
- 时间显示按秒边界自动刷新
- 移动端单列滚动布局

## 配置

应用名称和显示版本来自仓库根目录的 `config.json`：

```json
{
  "name": "Subject Stack",
  "version": "B1"
}
```

Vite 会通过虚拟模块读取该配置。开发服务器运行期间修改 `config.json`，页面会自动刷新。

背景图片位于 `frontend/public/background.webp`，代码中以 `/background.webp` 引用。
