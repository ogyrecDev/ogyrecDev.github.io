---
title: "Palette-Based Voxel Chunk Storage"
description: "A practical look at per-chunk palettes, direct storage, bit packing, and the trade-offs behind compact voxel data."
image: /assets/img/posts/2025-07-28-efficient-block-storage-palettes/preview.png
date: 2025-07-28 21:30:00 +0200
last_modified_at: 2026-07-25 02:30:00 +0200
categories: [guides, voxel]
tags: [voxel, block-storage, palette, optimization, rust, chunk]
toc: true
---

Voxel storage looks simple until the world becomes large enough that a few bytes per cell turn into gigabytes.

A useful pattern is to separate **global block identity** from the compact value stored inside each chunk. A chunk-local palette lets the world support a large global set of block types without paying the full identifier width for every voxel.

This article focuses on the design itself rather than any one game's current implementation. My own engine architecture has changed since the first version of this post, but the underlying storage trade-offs are still useful.

## 1. Direct IDs: the simple baseline

Assume a `32 × 32 × 32` chunk:

```text
32 * 32 * 32 = 32,768 voxels
```

If every voxel stores a `u16` global block ID:

```rust
let blocks: Vec<u16> = vec![0; 32 * 32 * 32];
```

The raw block array takes:

```text
32,768 * 2 bytes = 65,536 bytes = 64 KiB
```

That is a perfectly reasonable representation. It is simple, direct, predictable, and fast to index.

The question is whether every chunk really needs the full global ID width for every cell.

## 2. Local palettes

A palette stores the global IDs used by one chunk and lets the voxel array store only an index into that palette.

A minimal representation might look like this:

```rust
struct Chunk {
    palette: Vec<BlockId>,
    blocks: Vec<u8>,
}
```

If the chunk contains at most 256 palette entries, each voxel needs only one byte.

For a `32³` chunk with `u16` global IDs, the worst case before an index-width transition is roughly:

```text
32,768 bytes for voxel indices
+ up to 512 bytes for 256 u16 palette entries
= 33,280 bytes
```

That is about 32.5 KiB instead of 64 KiB for the raw block field.

The important idea is not the exact percentage. It is that **local complexity controls local storage cost**.

## 3. Reading a voxel

The basic lookup is straightforward:

```rust
let palette_index = chunk.blocks[flat_index(x, y, z)];
let block_id = chunk.palette[palette_index as usize];
```

The extra indirection is usually cheap, but it is still a trade-off. Direct IDs have simpler access; palettes reduce memory when chunks reuse a small set of values.

## 4. Adding a block type to the palette

A naive insertion path could be:

```rust
fn palette_index_for(chunk: &mut Chunk, block: BlockId) -> Option<u8> {
    if let Some(index) = chunk.palette.iter().position(|&id| id == block) {
        return Some(index as u8);
    }

    if chunk.palette.len() == 256 {
        return None;
    }

    chunk.palette.push(block);
    Some((chunk.palette.len() - 1) as u8)
}
```

For tiny palettes, a linear search can be completely adequate. If palette mutation becomes hot, a reverse lookup table or another indexing strategy may be worthwhile.

Measure before complicating it.

## 5. What happens after 256 entries?

A `u8` index has 256 possible values, so the representation needs a transition once the palette grows beyond that.

There are several reasonable designs.

### Wider palette indices

Promote the chunk from `u8` indices to `u16` indices.

**Advantages:**

- conceptually simple
- keeps palette semantics
- direct indexing remains easy

**Cost:**

- the voxel index array doubles from 32 KiB to 64 KiB for a `32³` chunk

For unusually diverse chunks, that may still be entirely acceptable.

### Direct global IDs

Switch the chunk to direct global IDs once palette compression stops being useful.

This can be attractive when the widened palette representation would cost roughly the same as direct storage anyway.

### Bit-packed indices

Instead of fixing the index width to 8 or 16 bits, choose a width based on the current palette size.

For example:

- 2 entries -> 1 bit
- 4 entries -> 2 bits
- 16 entries -> 4 bits
- 256 entries -> 8 bits

This can reduce memory further, especially for simple chunks, but it adds packing/unpacking logic and makes mutation more complicated.

It is a classic memory-versus-complexity trade-off.

## 6. Global identity can stay wide

The chunk-local representation does not need to limit the global content space.

For example:

```rust
type BlockId = u32;
```

A chunk may still store one-byte local indices if it happens to use only a small subset of those global block IDs.

This separation is especially useful in data-driven or moddable systems because global identity and local storage density solve different problems.

## 7. Palette identity is not content identity

One architectural mistake is allowing a local palette index to escape the chunk and become a persistent block identity.

It should not.

Palette index `7` only means "entry seven in this specific palette." If the palette is rebuilt, serialized differently, compacted, or reordered, that number may change.

Persistent references should use a stable global identity. Palette indices are storage details.

That distinction becomes important for serialization, networking, editing, and hot reload.

## 8. Mutation and serialization matter

The best in-memory layout is not automatically the best overall design.

Ask how the chunk behaves when:

- a new block type appears during editing
- an old palette entry becomes unused
- the chunk is serialized and loaded again
- block definitions are remapped
- a network snapshot or delta references block identity
- a storage format changes between versions

A palette format should have explicit rules for these transitions rather than relying on incidental vector order.

## 9. A practical representation

One useful model is an enum that makes the storage mode explicit:

```rust
enum BlockStorage {
    Uniform(BlockId),
    Paletted8 {
        palette: Vec<BlockId>,
        indices: Vec<u8>,
    },
    Direct16(Vec<u16>),
}
```

A real engine may use different names, wider IDs, bit packing, copy-on-write data, compressed serialization, or additional states. The value of this shape is that the transition rules become visible in the type system.

A completely uniform chunk can even collapse to one value with no per-voxel array at all.

## 10. What I would optimize first

Before building an elaborate compression system, I would measure:

1. typical unique block count per chunk
2. percentage of uniform chunks
3. memory consumed by block storage versus lighting, mesh data, physics, entities, and caches
4. read/write frequency
5. serialization cost
6. how often chunks cross representation thresholds

The best design depends on workload.

A dense editor workload can favor different trade-offs from a mostly immutable streamed world.

## Summary

Per-chunk palettes are useful because they decouple a large global content space from the small set of values most chunks actually contain.

The core rules are simple:

- keep global identity stable and separate from local storage indices
- choose index width based on measured chunk diversity
- define representation transitions explicitly
- consider uniform storage before more complex compression
- treat serialization and mutation as part of the format design
- benchmark the real workload before optimizing for theoretical density

That gives you a storage system that can stay compact without turning local compression details into global engine semantics.

---

For more current engine work, see the **[Projects](/projects/)** page or **[my GitHub](https://github.com/ogyrec-o)**.
