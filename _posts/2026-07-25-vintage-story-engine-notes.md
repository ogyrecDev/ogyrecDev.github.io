---
title: "Voxel Engine Notes from Discussions with Vintage Story's Tyron Madlener"
description: "What I learned from two technical discussions with Vintage Story creator Tyron Madlener about chunk streaming, voxel storage, mesh lifetime, chunk boundaries, and face culling."
date: 2026-07-25 02:55:00 +0200
categories: [engineering, voxel]
tags: [vintage-story, voxel, chunk-streaming, block-storage, face-culling, rendering, engine-architecture]
toc: true
---

In 2025, while working on an earlier version of my voxel engine/game architecture, I had two short technical discussions with **Tyron Madlener**, creator of [Vintage Story](https://www.vintagestory.at/).

The first was about chunk streaming, memory usage, block storage, mesh lifetime, and chunk boundaries. The second came a few months later, after I had been comparing face-culling behavior for cubes, stairs, and slabs across different voxel games.

Those conversations were useful because they were grounded in a shipped, moddable voxel game rather than a theoretical engine design.

This post is **my summary and interpretation** of what I learned from those discussions. I am deliberately not publishing the private correspondence verbatim, and the implementation details described here refer to what Tyron explained to me in 2025. They should not be treated as authoritative documentation of Vintage Story's current internals.

## Why I reached out

At the time, my voxel work had several problems at once:

- chunk loading and unloading were becoming more complicated as the world grew
- memory usage was much higher than I wanted
- I was storing more per-block mesh data than made sense
- chunk-border meshing created awkward multithreading and locking problems
- non-cubic face culling was turning into a pile of special cases

Vintage Story was an obvious project to study because it has spent years solving these problems in a real game with large worlds, custom block shapes, and extensive modding support.

I was not looking for code to copy. I wanted to understand the **shape of the solution** and the trade-offs behind it.

## 1. Chunk visibility can be server-driven

One of the first things Tyron explained was that Vintage Story's chunk loading is server-driven.

The server decides which chunks a client should see and tracks what has already been sent to each player. When a player crosses a chunk boundary, nearby candidates are reevaluated. New candidates are handed to the chunk-loading system, while another part of the runtime can identify loaded chunks that are no longer in range of any player and unload them.

The interesting idea here is not the exact Vintage Story implementation. It is the separation of responsibilities:

```text
player movement
    -> visibility / candidate evaluation
        -> chunk load requests
            -> disk / generation work

loaded world state
    -> retention evaluation
        -> unload decisions
```

That is much easier to reason about than letting every subsystem independently decide whether a chunk should exist.

It also reinforced a design principle I still use now: **world residency is a policy, while loading is a mechanism**. The code that decides *what should be resident* should not have to be the same code that performs disk I/O or generation.

## 2. Keep expensive mesh data at the right granularity

I had been thinking too much in terms of block instances carrying rendering data.

Tyron explained that Vintage Story keeps mesh data per **block shape**, rather than duplicating the same vertex/normal/UV data for every block instance that uses that shape.

That distinction sounds obvious in hindsight, but it is exactly the kind of mistake that appears naturally in an early implementation: a block owns a model, therefore every block instance appears to own model data.

A better separation is closer to:

```text
block instance
    -> block/content identity
        -> shape identity
            -> reusable shape mesh data
```

The world stores compact state. Rendering resolves that state into shared geometry.

This same principle generalizes far beyond voxels: **store identity and state at instance granularity; store reusable heavy data at asset granularity**.

## 3. CPU mesh lifetime does not have to match GPU mesh lifetime

Another useful detail was that chunk mesh data does not need to live forever in CPU memory just because it exists on the GPU.

Tyron described chunk meshes being kept in CPU RAM during generation and then uploaded to VRAM.

That pushed me to think more explicitly about resource lifetime:

```text
voxel state
    -> temporary CPU mesh build data
        -> GPU resource
```

Those are three different things with three different ownership and lifetime requirements.

Keeping all three indefinitely is convenient, but convenience can become a very large memory bill once the loaded world grows.

The broader lesson is to avoid treating a resource pipeline as one permanent object graph. Intermediate representations should be allowed to die when their job is finished.

## 4. Per-chunk palettes are a natural fit for voxel data

The storage idea that influenced my early voxel work most directly was Vintage Story's use of a palette-like block representation.

Tyron described each `32 x 32 x 32` chunk as having its own palette of block types plus compact per-voxel indices into that palette, similar in spirit to how an indexed-color image stores a small palette and per-pixel indices.

Why this works is straightforward: a game may support a huge global content space, while an individual chunk normally contains only a small subset of it.

So instead of forcing every voxel to pay for the full global identifier width:

```text
global content identity
        |
        v
chunk-local palette
        |
        v
compact per-voxel index
```

The useful architectural idea is the separation between **global identity** and **local storage representation**.

I later expanded this into my own more general discussion of uniform, paletted, widened, and direct storage modes in [Palette-Based Voxel Chunk Storage](/posts/efficient-block-storage-palettes/).

## 5. Simple full-chunk remeshing can still be a valid choice

I also asked whether breaking one block required rebuilding an entire chunk mesh.

The answer at the time was yes.

That was a useful reminder that a shipped engine does not need the theoretically most granular update mechanism everywhere.

Partial mesh patching can sound obviously superior because less geometry changes. But it also introduces more bookkeeping, more fragmentation, more update paths, and more state that can get out of sync.

Sometimes the right question is not:

> Can I rebuild less?

but:

> Is the simpler rebuild already within budget?

If a full chunk rebuild is fast enough and occurs rarely enough, the simpler design may be the better engineering choice.

## 6. Chunk boundaries deserve their own design

At the time I was also struggling with faces at chunk edges. Neighboring chunks could be loading or meshing on different threads, and directly mutating adjacent chunk data made synchronization increasingly ugly.

Tyron mentioned that Vintage Story had a solution where chunk-edge geometry could exist as separate meshes that were loaded and unloaded as needed, while also noting that this made the code more complicated.

I like that detail because it contains both sides of real engineering:

- yes, a specialized representation can solve the lifetime problem
- no, it is not free; the extra representation creates extra complexity

Today I prefer to think of chunk-border handling as a question of **dependency availability and remesh policy**, rather than something that should force neighboring chunks to mutate each other.

A chunk mesher should ideally consume a read-only neighborhood view and produce output from the state that is currently available. The streaming system can decide when missing-neighbor information requires another mesh update.

## 7. Face culling gets interesting when blocks stop being cubes

A few months later I contacted Tyron again after comparing stair and slab behavior in Vintage Story and Minecraft.

Some faces I expected to disappear in Vintage Story were still being rendered. I initially wondered whether this was a deliberate design trade-off for modding or performance.

Tyron's answer was refreshingly practical: at least some of those cases were simply opportunities for further optimization rather than a deep intentional rule.

He explained that, while constructing a chunk mesh, Vintage Story tests visibility for each of the six block sides and only adds visible faces. The basic solid-neighbor idea is then extended with special handling for different material cases.

Vintage Story's public API still exposes an [`EnumFaceCullMode`](https://apidocs.vintagestory.at/api/Vintagestory.API.Client.EnumFaceCullMode.html), which is a good public example of the fact that real face culling usually needs more semantics than a single opaque/not-opaque flag.

## 8. Precompute the small state, not every possible pair

One idea I proposed was to precompute whether every possible combination of:

```text
model A
x model B
x rotation A
x rotation B
x direction
```

should cull.

The attraction is obvious: runtime culling becomes a lookup.

Tyron pushed back on the memory side of that design and made a broader point about cache behavior: a computation that stays inside the CPU caches can be cheaper than a lookup into a huge precomputed table in main memory.

That is an important distinction.

"Precomputed" does not automatically mean "fast".

A giant lookup structure can trade arithmetic for:

- memory footprint
- cache misses
- initialization cost
- data invalidation problems
- much worse scaling as custom/modded shapes increase

The version of this idea I prefer now is much smaller: precompute **per-shape/per-orientation boundary information**, not every possible pair of shapes.

Then runtime comparison can be a few bit operations on compact data that is likely to stay cache-friendly.

That is the model I describe in [Face Culling for Voxel Cubes and Partial Shapes](/posts/face-culling/).

## 9. The most useful lesson was not a specific algorithm

The biggest value of these discussions was not learning that Vintage Story uses a palette, or that it rebuilds a chunk mesh, or that it has special face-culling modes.

It was seeing a mature engine make **deliberate trade-offs at subsystem boundaries**.

A few patterns kept repeating:

- keep shared data shared instead of copying it into instances
- separate policy from mechanism
- let temporary representations actually be temporary
- optimize storage around real local diversity
- prefer a simple rebuild when it is already fast enough
- accept a specialized representation only when its complexity pays for itself
- consider memory locality, not just operation counts
- keep material semantics separate from geometric visibility

Those are much more reusable lessons than any one implementation detail.

## 10. How this affected my own work

My current engine architecture is very different from the one I had when these conversations happened.

I am building a general-purpose Rust engine now, with Freven as a downstream game rather than a game-specific engine core. My current voxel systems, content identity, render boundaries, and runtime ownership rules have evolved significantly since 2025.

But these discussions helped shape how I think about the problems.

The most direct examples are:

- treating stable content identity separately from compact runtime/storage representation
- being much stricter about resource lifetime and ownership
- avoiding backend/render details leaking into high-level world state
- using downstream gameplay to validate engine abstractions
- preferring bounded, cache-friendly representations over giant precomputed spaces

That is why I think conversations with engineers who have actually shipped and maintained these systems are so valuable. Even when you do not copy their solution, you get to see which problems became important in reality.

## A note on publishing this

After the face-culling discussion, I sent Tyron the original version of my article and explicitly told him it was heavily inspired by what he had explained and by my observations of Vintage Story. He told me it was fine to publish.

I still prefer not to reproduce private emails here. This article keeps the discussion at the level that is actually useful: the engineering ideas, the trade-offs, and what I learned from them.

For future questions, Tyron also suggested using Vintage Story's public `#gamedev` discussion space where possible so technical information can remain searchable and useful to other developers too. I think that is a good principle in general.

---

Vintage Story is actively developed, so for current public behavior and APIs, use the [official Vintage Story site](https://www.vintagestory.at/) and [API documentation](https://apidocs.vintagestory.at/).

For my current work, see **[Projects](/projects/)** or **[GitHub](https://github.com/ogyrec-o)**.
