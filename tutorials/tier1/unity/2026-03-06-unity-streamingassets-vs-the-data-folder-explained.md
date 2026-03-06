# Unity StreamingAssets vs the Data Folder Explained

This article explains what Unity's `StreamingAssets` folder is, why it exists, and how it differs from the regular `Data/` folder produced by a Unity build.

## What is StreamingAssets?

`StreamingAssets` is a special Unity folder where files are copied **as-is** (raw, unprocessed) into the build output. At runtime, these files are accessible via a well-known path:

```csharp
Application.streamingAssetsPath
```

Unity does not import, compress, or transform files placed in this folder — they arrive in the build exactly as you authored them.

## The Problem with the Regular Data Folder

Unity's `Data/` folder contains **processed, compiled, and compressed assets** — files like `globalgamemanagers`, `sharedassets0.assets`, and `resources.assets`. These are Unity's internal binary formats that:

- Are not human-readable
- Have been compressed and serialized by Unity's asset pipeline
- Cannot be swapped out at runtime without rebuilding the project
- Are not directly addressable by a file path at runtime

If you want to load a video, a JSON config file, or a custom binary at runtime using a file path, you cannot simply place it in the regular data folder. Unity would process it during the import step, and you would lose direct file access.

## Comparison

| Feature | Regular Data Folder | StreamingAssets |
|---|---|---|
| Files copied as-is | No (processed/compressed) | Yes |
| Accessible by file path at runtime | No | Yes |
| Can be modified after build | No | Yes (on PC/Mac) |
| Works on Android | N/A | Yes (via `UnityWebRequest`) |
| Survives Unity import pipeline | No | Yes |

## Typical Use Cases

`StreamingAssets` is the right choice when you need to:

- Read **JSON or XML config files** at runtime with `File.ReadAllText()`
- Load **video files** (`.mp4`) via `VideoPlayer`
- Embed and query a **SQLite database**
- Load **custom binary data** such as terrain, navigation meshes, or external maps
- Ship **localization files** that translators can update without a full rebuild

## How to Read a StreamingAssets File

On PC and macOS, use standard file I/O directly:

```csharp
string path = Path.Combine(Application.streamingAssetsPath, "config.json");
string json = File.ReadAllText(path);
```

On **Android**, files inside the `.apk` archive are not accessible via the file system directly. Use `UnityWebRequest` instead:

```csharp
IEnumerator LoadConfig()
{
    string path = Path.Combine(Application.streamingAssetsPath, "config.json");
    using UnityWebRequest request = UnityWebRequest.Get(path);
    yield return request.SendWebRequest();
    string json = request.downloadHandler.text;
}
```

## Summary

The regular `Data/` folder is Unity's **internal asset database** — optimised for the engine, not for direct runtime file access. `StreamingAssets` is a **pass-through folder** for any file you need raw, unmodified access to at runtime.
