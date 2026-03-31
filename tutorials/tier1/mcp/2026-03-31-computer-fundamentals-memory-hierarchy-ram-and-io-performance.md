# Computer Fundamentals for AI Developers: Memory Hierarchy, RAM, and I/O Performance

This article covers the low-level computer science concepts that underpin how AI tool servers — like MCP servers — communicate with their host. Understanding memory hierarchy, RAM latency, and storage bandwidth explains why certain design choices (like STDIO over HTTP for local tools) exist, and why file copying feels slow regardless of CPU speed.

## The Memory Hierarchy

Every program you run travels through a multi-layered memory system. The CPU cannot reach main RAM for every instruction — that would be far too slow — so the hardware keeps a hierarchy of faster-but-smaller storage layers close to the processor.

The full chain, from fastest to slowest:

| Level | Size | Latency | Bandwidth |
|-------|------|---------|-----------|
| CPU Registers | < 1 KB | < 0.3 ns | — |
| L1 Cache | ~64 KB per core | ~1 ns | ~1 TB/s |
| L2 Cache | ~256 KB per core | ~4 ns | ~400 GB/s |
| L3 Cache | ~16 MB shared | ~30 ns | ~200 GB/s |
| RAM (DDR5) | 16–64 GB | ~50 ns | ~80 GB/s |
| NVMe SSD | — | ~100 µs | ~7 GB/s |

The CPU performs all actual computation only in **registers** — tiny storage locations directly on the processor chip. Every instruction the CPU executes reads from and writes to registers. Cache is the intermediary: the hardware prefetches cache lines (64 bytes at a time) from RAM into L3 → L2 → L1 so that the next instruction is likely already waiting in L1 when the CPU needs it.

When the requested data is in L1, it is a **cache hit** — nearly instantaneous. When it is not, the CPU stalls — a **cache miss** — and must walk back down the hierarchy. This stall is called a **pipeline stall**. The CPU literally has nothing to do while waiting for data.

The implication: from the moment the CPU asks RAM for data to the moment it arrives, 200+ CPU cycles could have elapsed. That is why cache-friendly code — iterating arrays sequentially so prefetchers can work ahead — can be 10–100× faster than equivalent code that jumps around memory randomly.

## Why STDIO Wins for Local AI Tool Servers

Model Context Protocol (MCP) supports multiple transport mechanisms for sending messages between the AI host and the server. For local tools, **STDIO is the default and preferred choice** — not by accident.

STDIO uses operating system pipes: a kernel-managed memory buffer that connects the stdout of one process directly to the stdin of another. On a single machine, this is:

- **Zero networking** — no TCP/IP stack, no ports, no IP addresses
- **Zero configuration** — the parent process owns both ends of the pipe from the moment it spawns the child
- **Zero latency overhead** — pipes live entirely in kernel RAM; data never touches the disk or network stack
- **Naturally synchronous** — the parent writes a request and reads the response on the same pipe; no connection state to manage

The trade-off: pipes do not cross machine boundaries. As soon as the AI host and the MCP server need to run on different machines, you must switch to HTTP or SSE transport.

## Understanding stdin, stdout, and Pipes

Every process on Linux, Windows, and macOS is born with three pre-wired file handles:

- **stdin (file descriptor 0)** — where the process reads input
- **stdout (file descriptor 1)** — where the process writes normal output
- **stderr (file descriptor 2)** — where the process writes error messages

A **pipe** is a kernel-managed buffer that wires stdout of one process to stdin of another. When you run an MCP server via STDIO transport, the AI host spawns the server as a child process and connects to its stdin/stdout pipes:

```
AI Host (parent process)              MCP Server (child process)
  │                                          │
  │  writes JSON-RPC request                 │
  │ ────────────────────────────────────►    │  reads from its stdin
  │  {"jsonrpc":"2.0","method":"tools/call"} │
  │                                          │
  │ ◄────────────────────────────────────    │  writes JSON-RPC response
  │  {"jsonrpc":"2.0","result":{...}}       │     to its stdout
```

From the MCP server's perspective, it simply calls `input()` to read and `print()` to reply. It has no idea it is being driven by an AI. The pipe makes the parent process look like a keyboard and terminal.

The critical detail in Python: always flush stdout after writing, or the kernel buffer will hold the data indefinitely:

```python
sys.stdout.write(json.dumps(response) + '\n')
sys.stdout.flush()  # forces the kernel to send immediately
```

Python buffers stdout by default for performance. Without `flush()`, the parent process waits forever.

## Why File Copying Feels Slow: Storage Bandwidth

When you copy a file, the data path is:

```
SSD (source) → RAM (read buffer) → RAM (write buffer) → SSD (destination)
```

The bottleneck is almost always the storage layer at both ends — not the CPU or RAM.

| Storage Type | Typical Bandwidth |
|---|---|
| NVMe SSD | ~7 GB/s |
| SATA SSD | ~500 MB/s |
| HDD | ~100 MB/s |

Even the fastest NVMe drive is roughly 10× slower than DDR5 RAM. The CPU and RAM are effectively standing by, waiting on the drive.

Two nuances that explain surprising behaviour:

**Page cache makes repeated copies faster.** The OS reads a file into a RAM buffer called the page cache before writing. On a second copy of the same file, the source read is served entirely from page cache in RAM — no SSD involved. This is why the second file copy often appears noticeably faster.

**CPU spikes during copy are overhead, not calculation.** The CPU is handling syscalls, DMA (Direct Memory Access) coordination, and filesystem metadata updates. It is mostly idle — the storage device is doing the real work.

## FastMCP Transports: STDIO, HTTP, and SSE

FastMCP supports three transport mechanisms:

**STDIO (default)** — The host spawns the server as a subprocess and communicates via stdin/stdout pipes. Ideal for local tools. Simple, fast, zero configuration.

**Streamable HTTP** — The host sends an HTTP POST with the JSON-RPC request and receives a chunked streaming response. This is the modern choice for web-deployed or remote MCP servers. One connection handles both directions cleanly.

**SSE (deprecated)** — The older web approach. The client opens a persistent GET connection to receive server-pushed events, while sending its own requests via separate POST calls. Two connections instead of one. Being retired in favour of Streamable HTTP.

In all three cases, the **protocol** — what JSON-RPC messages mean, how a tool call is structured — is identical. Only the delivery mechanism changes. Transport is the pipe; protocol is the language spoken through it.
