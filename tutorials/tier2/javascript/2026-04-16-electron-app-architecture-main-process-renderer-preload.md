# Electron 应用架构：主进程、渲染进程与预加载脚本

Electron 是一个用 Web 技术（HTML、CSS、JavaScript）构建跨平台桌面应用的框架。本文介绍 Electron 应用的核心架构，帮助你理解主进程、渲染进程和预加载脚本之间的关系。

## 进程模型

Electron 应用实际上运行在**两个独立的进程**中：

### 主进程（Main Process）

- 每个 Electron 应用只有**一个**主进程。
- 运行完整的 Node.js 环境，拥有对文件系统、操作系统原生 API、Ollama 等后端服务的完全访问权限。
- 负责创建和管理 BrowserWindow（应用窗口）、处理应用生命周期（启动、退出、菜单、托盘等）、与操作系统交互。

### 渲染进程（Renderer Process）

- 每个 BrowserWindow 对应一个渲染进程。
- 本质上是一个跑在 Chromium 里的 Web 页面（你的 React/Vue/Vite 前端就在这里）。
- 默认处于**沙箱模式**，没有直接访问 Node.js 或系统 API 的能力，无法读写本地文件或调用系统命令。

```
┌─────────────────────────────────────────┐
│  Main Process (Node.js, full access)    │
│  - file system, native APIs             │
│  - Ollama backend                      │
└───────────────────┬─────────────────────┘
                    │  contextBridge / IPC
┌───────────────────┴─────────────────────┐
│  Renderer Process (Chromium, sandboxed) │
│  - React app (Vite served)              │
│  - no direct Node.js access             │
└─────────────────────────────────────────┘
```

## 预加载脚本（Preload Script）

预加载脚本是连接主进程和渲染进程的**桥梁**：

- 它运行在独立的上下文中，既不属于主进程也不属于渲染进程的完整沙箱。
- 通过 Electron 提供的 `contextBridge` API，安全地将主进程中的部分能力暴露给渲染进程。
- 渲染进程只能调用预加载脚本中通过 `contextBridge.exposeInMainWorld` 暴露的接口，不能直接调用 Node.js 模块。

**编译预加载脚本**：

```bash
tsc -p tsconfig.preload.json
```

上述命令将预加载脚本从 TypeScript 编译为 JavaScript，输出到 `dist-electron/` 目录，供 Electron 主进程加载。

## 进程间通信（IPC）

由于渲染进程处于沙箱中，无法直接调用主进程的 API。两者之间通过 **IPC（Inter-Process Communication）** 机制通信：

- **渲染进程** 通过 `window.electronAPI`（由 preload 暴露）发送消息。
- **主进程** 通过 `ipcMain.handle` 注册处理器，处理来自渲染进程的请求并返回结果。

## 典型开发启动流程

一个 Electron 应用的开发启动脚本通常会：

1. 编译主进程和预加载脚本（TypeScript → JavaScript）。
2. 启动前端开发服务器（如 Vite）。
3. 等待前端服务就绪后，启动 Electron 应用。

```json
{
  "electron:dev": "npm run build:main && concurrently -k \"vite\" \"wait-on http://localhost:5173 && electron . --dev\""
}
```

## 小结

| 组件 | 职责 |
|------|------|
| 主进程 | Node.js 后端，全系统访问权 |
| 渲染进程 | 前端 UI，运行在 Chromium 沙箱中 |
| 预加载脚本 | 安全桥接两者，通过 contextBridge 暴露受控接口 |
| IPC | 主进程和渲染进程之间的双向通信机制 |
