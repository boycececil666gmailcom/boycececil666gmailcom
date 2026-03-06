# Understanding the Unity Mono Build Structure

When you build a Unity project for Windows using the **Mono scripting backend**, the output is a self-contained folder with a well-defined structure. This article breaks down every part of that structure and explains what role each file and folder plays at runtime.

---

## Root-Level Files — The Launch Layer

| File | Purpose |
|---|---|
| `YourGame.exe` | Entry point. A thin shell that bootstraps the Mono runtime and hands control to `UnityPlayer.dll`. |
| `UnityPlayer.dll` | The Unity engine core. Contains the render loop, scene management, physics, audio, and all engine subsystems. |
| `UnityCrashHandler64.exe` | A separate watchdog process that catches unhandled crashes and shows a crash dialog or generates a report. |
| `WinPixEventRuntime.dll` | Microsoft PIX GPU profiling support for frame capture and GPU performance analysis in dev/profiling builds. |

---

## `D3D12/` — Direct3D 12 Agility SDK

Contains `D3D12Core.dll` and `d3d12SDKLayers.dll`.

These are Microsoft's **D3D12 Agility SDK** redistributables. They allow Unity to ship a newer Direct3D 12 runtime than what the user's Windows installation provides natively, enabling modern GPU features regardless of OS version.

---

## `MonoBleedingEdge/` — The Mono Runtime

This folder is what makes a build a *Mono* build, as opposed to IL2CPP.

### `EmbedRuntime/`

| File | Purpose |
|---|---|
| `mono-2.0-bdwgc.dll` | The Mono JIT compiler and garbage collector (uses the Boehm-Demers-Weiser GC). Executes your managed C# assemblies at runtime. |
| `MonoPosixHelper.dll` | A POSIX compatibility shim that enables cross-platform .NET APIs to work on Windows. |

### `etc/mono/`

Configuration files for Mono's .NET framework compatibility profiles: `2.0`, `4.0`, and `4.5`. Each profile directory contains `machine.config`, `web.config`, and browser capability definitions. These configure how Mono behaves when loading assemblies targeting different .NET API levels.

**Key distinction vs IL2CPP:** In a Mono build, C# is compiled to CIL bytecode and JIT-compiled at runtime by `mono-2.0-bdwgc.dll`. In an IL2CPP build, C# is transpiled to C++ and compiled to native code ahead-of-time — the `MonoBleedingEdge/` folder does not exist in IL2CPP builds.

---

## `YourGame_Data/` — All Game Data

This is the most important folder. Everything the game needs to run lives here.

### Configuration Files

| File | Purpose |
|---|---|
| `app.info` | Contains the company name and product name, displayed in the crash handler window. |
| `boot.config` | Low-level startup configuration: graphics API overrides, XR settings, player settings flags. Read before the engine fully initialises. |
| `RuntimeInitializeOnLoads.json` | Lists all methods decorated with `[RuntimeInitializeOnLoad]` across all assemblies. Unity calls these automatically at startup. |
| `ScriptingAssemblies.json` | Maps every managed DLL to its assembly type filter flags. Tells Unity which assemblies to load and how to categorise them. |

### Scene and Asset Files

| File | Purpose |
|---|---|
| `level0`, `level1`, … | Serialised binary scene data. Each file corresponds to a scene in the build. Contains all GameObjects, component data, and hierarchy relationships. |
| `globalgamemanagers` | Core Unity subsystem state: Project Settings, Physics settings, Quality settings, Audio settings, Tag/Layer definitions, etc. |
| `globalgamemanagers.assets` | Asset objects referenced by the game managers — default materials, physics materials, and similar. |
| `sharedassets0.assets` | Shared assets for Scene 0: textures, meshes, materials, prefabs, audio clips, etc. referenced by objects in that scene. |
| `resources.assets` | All assets placed in `Resources/` folders in the project, loadable at runtime via `Resources.Load()`. |
| `.resS` files | Raw binary streams split out from their parent `.assets` files. Large binary blobs (texture pixel data, audio PCM, etc.) stored here separately to allow memory-mapping without loading the full asset table. |

### `Resources/`

| File | Purpose |
|---|---|
| `unity default resources` | Built-in Unity primitive meshes (Cube, Sphere, etc.), default materials, and built-in shaders. |
| `unity_builtin_extra` | Additional built-in assets used by UGUI: default sprites, the built-in UI font (Arial), and related resources. |

### `StreamingAssets/`

Files placed here are copied verbatim to the build and accessible at runtime via `Application.streamingAssetsPath`. They are not processed or compressed by Unity.

If your project uses **Unity DOTS/Entities**, you will find an `EntityScenes/` subfolder here containing binary `.bin` files — these are serialised ECS subscenes streamed at runtime by the Entities package.

### `Plugins/x86_64/`

Contains native (unmanaged) DLLs and their debug symbols. The most common example in a DOTS project is:

- `lib_burst_generated.dll` — The output of the **Burst compiler**. Burst compiles C# Jobs (marked with `[BurstCompile]`) to highly optimised native x64 machine code ahead-of-time. This DLL is loaded at startup and replaces the Mono JIT paths for those jobs, giving near-native performance for ECS/Jobs code.

### `Managed/` — All C# Assemblies

This is the full managed (.NET) code layer. All `.dll` files here are loaded by the Mono runtime at startup.

#### Your Game Code

Unity compiles each **Assembly Definition (`.asmdef`)** in your project into a separate DLL. A typical project produces assemblies like:

```
Assembly-CSharp.dll              ← scripts not in any .asmdef (catch-all)
Assembly-CSharp-firstpass.dll    ← plugins/legacy scripts in Standard Assets
MyFeature.dll                    ← scripts in a named .asmdef
```

Splitting code into multiple `.asmdef` files speeds up incremental compilation: only the changed assembly needs to be recompiled.

#### Unity Engine Modules

Each Unity subsystem ships as a separate DLL:

```
UnityEngine.CoreModule.dll
UnityEngine.AnimationModule.dll
UnityEngine.AudioModule.dll
UnityEngine.PhysicsModule.dll
UnityEngine.UIModule.dll
UnityEngine.ParticleSystemModule.dll
... (many more)
```

This modular split means Unity can strip unused modules from the build, reducing the final size.

#### Unity Package Runtime DLLs

Packages installed via the Package Manager each ship a runtime assembly, for example:

```
Unity.Entities.dll                              ← DOTS ECS
Unity.Collections.dll                           ← NativeArray, NativeList, etc.
Unity.Mathematics.dll                           ← SIMD-friendly math types
Unity.Burst.dll                                 ← Burst compiler API
Unity.RenderPipelines.Universal.Runtime.dll     ← URP
Unity.TextMeshPro.dll
Unity.AI.Navigation.dll
```

#### Mono / .NET Base Class Library (BCL)

```
mscorlib.dll          ← Core types: object, string, int, List<T>, Dictionary, etc.
System.dll
System.Core.dll       ← LINQ, expression trees
netstandard.dll       ← .NET Standard 2.1 facade
System.Xml.dll
System.IO.Compression.dll
... (many more)
```

These are bundled with the build so it runs on machines that do not have .NET installed.

#### `.pdb` Files

Every `.dll` has a corresponding `.pdb` (Program Database) file alongside it. These are **debug symbol files** that map compiled CIL byte offsets back to original source file paths and line numbers. Without them, stack traces in crash logs show only hex addresses; with them, you get `MyScript.cs:42`.

---

## How It All Fits Together at Startup

```
YourGame.exe
  │
  ├─ loads UnityPlayer.dll                  ← engine core
  │    ├─ loads MonoBleedingEdge/EmbedRuntime/mono-2.0-bdwgc.dll
  │    │    └─ JIT-compiles and loads all Managed/*.dll
  │    ├─ loads D3D12/D3D12Core.dll         ← GPU runtime
  │    ├─ loads Plugins/x86_64/lib_burst_generated.dll
  │    │    └─ native Burst-compiled Jobs replace JIT paths
  │    └─ reads YourGame_Data/
  │         ├─ boot.config                  ← startup flags
  │         ├─ globalgamemanagers           ← engine settings
  │         ├─ level0                       ← first scene
  │         └─ resources.assets            ← Resources/ content
  │
  └─ launches UnityCrashHandler64.exe       ← crash watchdog
```

---

## Mono vs IL2CPP: Key Build Differences

| Aspect | Mono | IL2CPP |
|---|---|---|
| C# execution | JIT-compiled at runtime | AOT-compiled to native code |
| `MonoBleedingEdge/` folder | Present | Absent |
| Build time | Faster | Slower |
| Runtime performance | Good | Better (especially CPU-heavy code) |
| Debuggability | Easier (attach Mono debugger) | Harder |
| Platform support | Windows, Mac, Linux | All platforms (required for iOS, consoles) |
| Output size | Smaller | Larger (native code is bigger than CIL) |

For desktop development and fast iteration, Mono is the practical choice. Switch to IL2CPP for final releases targeting performance-critical or locked-down platforms.
