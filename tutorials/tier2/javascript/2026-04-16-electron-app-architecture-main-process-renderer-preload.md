# Electron App Architecture: Main Process, Renderer Process, and the Preload Script

Electron is a framework for building cross-platform desktop applications using web technologies (HTML, CSS, JavaScript). This article explains the core architecture of an Electron app — specifically the relationship between the main process, the renderer process, and the preload script.

## The Process Model

An Electron app runs on **two separate processes**:

### Main Process

- There is only **one** main process per Electron application.
- It runs a full Node.js environment with unrestricted access to the file system, native OS APIs, Ollama backends, and other system-level services.
- It is responsible for creating and managing BrowserWindows, handling app lifecycle events (startup, quit, menus, system tray, etc.), and interacting with the OS.

### Renderer Process

- Each BrowserWindow has its own renderer process.
- It is essentially a web page running inside Chromium — your React/Vue/Vite frontend lives here.
- By default, it runs in a **sandboxed environment**, meaning it has no direct access to Node.js or OS APIs. It cannot read files or execute system commands on its own.

```
┌─────────────────────────────────────────┐
│  Main Process (Node.js, full access)    │
│  - file system, native APIs             │
│  - Ollama backend                      │
└───────────────────┬─────────────────────┘
                    │  contextBridge / IPC
┌───────────────────┴─────────────────────┐
│  Renderer Process (Chromium, sandboxed) │
│  - React app (Vite served)             │
│  - no direct Node.js access             │
└─────────────────────────────────────────┘
```

## The Preload Script

The preload script is the **bridge** between the main process and the renderer process:

- It runs in its own isolated context — neither fully part of the main process nor the renderer's sandbox.
- It uses Electron's `contextBridge` API to safely expose a limited set of main process capabilities to the renderer.
- The renderer can only call functions explicitly exposed via `contextBridge.exposeInMainWorld`. It cannot import Node.js modules directly.

**Compiling the preload script**:

```bash
tsc -p tsconfig.preload.json
```

This compiles the preload script from TypeScript to JavaScript, outputting to `dist-electron/`, where it is loaded by the main process.

## Inter-Process Communication (IPC)

Since the renderer is sandboxed and cannot call the main process directly, the two communicate through **IPC (Inter-Process Communication)**:

- The **renderer** calls exposed functions on `window.electronAPI` (provided by the preload) to send messages.
- The **main process** registers handlers with `ipcMain.handle` to process requests from the renderer and return results.

## Typical Development Startup Flow

A typical `electron:dev` script in `package.json` does the following:

1. Compile the main process and preload scripts (TypeScript → JavaScript).
2. Start the frontend dev server (e.g., Vite).
3. Wait for the frontend server to be ready, then launch Electron.

```json
{
  "electron:dev": "npm run build:main && concurrently -k \"vite\" \"wait-on http://localhost:5173 && electron . --dev\""
}
```

## Summary

| Component | Role |
|-----------|------|
| Main Process | Node.js backend with full system access |
| Renderer Process | Frontend UI, runs in a Chromium sandbox |
| Preload Script | Secure bridge, exposes limited APIs via contextBridge |
| IPC | Bidirectional communication channel between main and renderer |
