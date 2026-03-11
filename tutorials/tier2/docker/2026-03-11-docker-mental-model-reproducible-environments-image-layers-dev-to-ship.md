# Docker Mental Model — Reproducible Environments, Image Layers, and the Dev-to-Ship Loop

*Tier 2 — Building Experience · Docker · 2026-03-11*

---

## What Docker Actually Is

Docker packages an entire **runtime environment** — OS userland, libraries, tools, and configs — into a portable image. Anyone who runs that image gets an **identical environment**, regardless of their host OS.

The classic use case: a project like ROS 2 has a notoriously complex setup (apt sources, environment variables, Python deps, build tools). Instead of doing all that manually, `osrf/ros:humble-desktop` ships a pre-configured Ubuntu image where everything is already installed and sourced. Mount your code in, and it runs — no setup, no "works on my machine" issues.

---

## The Stack on Windows

On Windows, Docker Desktop uses WSL 2 as the Linux kernel layer. Containers share that kernel but have their own isolated filesystem and userspace:

```
Windows
  └── WSL 2 kernel
        └── Docker container (Ubuntu + ROS 2)
              └── your code (volume-mounted)
```

Docker images are stored inside a WSL 2 virtual disk, not as loose files on Windows:

```
C:\Users\<YourUsername>\AppData\Local\Docker\wsl\data\ext4.vhd
```

---

## Images Are Layered, Not a Single File

An image is a stack of **read-only layers**, each one a diff from the previous:

```
Layer 3: your changes (packages, configs you added)
Layer 2: osrf/ros:humble-desktop
Layer 1: Ubuntu base OS userland
Layer 0: scratch (empty base)
```

Docker stacks these at runtime to present a unified filesystem to the container. This has a practical benefit: if someone already has `osrf/ros:humble-desktop` pulled, they only need to download *your extra layers*. Shared base layers are reused across many images on the same machine.

---

## Dev Workflow vs. Ship Workflow

The key insight: **the container is both your dev environment AND your artifact**.

| Mode | Technique | When to use |
|------|-----------|-------------|
| **Development** | `volumes: .:/ros2_ws` (volume mount) | Active coding — changes on disk reflect instantly inside the container |
| **Shipping** | `COPY . /ros2_ws` in Dockerfile | Publishing — code is baked into the image itself |

During development, you `docker-compose up` → develop inside the container → `docker-compose build` to bake your environment changes → push the image so others can pull an identical setup.

When you publish, switch from volume mounts to `COPY` so the image is fully self-contained.

---

## The Full Loop

```
docker pull osrf/ros:humble-desktop   # get base image
# ... develop inside the container ...
docker build -t yourname/yourimage .  # bake into new image
docker push yourname/yourimage:tag    # upload layers to registry
# others:
docker pull yourname/yourimage:tag    # download only new layers
docker run yourname/yourimage:tag     # identical environment, zero setup
```

To export/import as a literal file (e.g. for airgapped transfer):

```bash
docker save yourimage:tag -o myimage.tar
docker load -i myimage.tar
```

---

## Summary

- **Image** = reproducible environment snapshot (layered, not a single file)
- **Container** = a running instance of an image
- **Volume mount** = your live code linked into the container for development
- **Dockerfile + COPY** = your code baked into the image for distribution
- **Docker Hub** = the registry (like GitHub, but for images)
- **WSL 2** = the Linux kernel Docker uses on Windows; images live in `ext4.vhd`
